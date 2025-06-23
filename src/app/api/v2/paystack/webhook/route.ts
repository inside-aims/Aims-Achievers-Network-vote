import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSupabase } from "@/config/server";
import { getMetadataFields } from "@/lib/utils";

export const config = {
  api: {
    bodyParser: false, // disable default JSON parsing
  },
};

export async function POST(req: NextRequest) {
  const supabase = await getServerSupabase();
  const secret = process.env.PAYSTACK_SECRET_KEY;

  // Read raw request body as Buffer
  const rawText = await req.text();

  // Get signature from headers
  const signature = req.headers.get("x-paystack-signature") || "";

  // Generate expected signature
  const expectedHash = crypto
    .createHmac("sha512", secret!)
    .update(rawText)
    .digest("hex");

  if (signature !== expectedHash) {
    console.warn("Invalid Paystack webhook signature");
    return NextResponse.json({ status: "Invalid signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawText);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    console.error("Invalid JSON payload:", rawText);
    return NextResponse.json({ status: "Invalid JSON" }, { status: 400 });
  }
  console.log("✅ Verified Paystack Webhook:", event);

  // Example: Handle successful payment
  if (event.event === "charge.success") {
    console.log(event.data.metadata.custom_fields);
    const { nomineeId, votesAmount, phoneNumber, nomineeName , categoryName} =
      getMetadataFields(event.data.metadata);
    const channel = event.data.channel;

    // TODO: Insert into Supabase or update vote status
    // await supabase.from('votes').insert({ msisdn, amount, nominee_id: nomineeId, reference, status: 'paid' });
    console.log("channel ",channel)
    if (channel === "mobile_money" && nomineeId && votesAmount) {
      const { error } = await supabase.from("vote").insert({
        referenceID: event.data.reference,
        numberOfVotes: votesAmount,
        nomineeID: nomineeId,
        phoneNumber: phoneNumber,
        channel: channel,
      });

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json(
          { error: "Failed to record vote" },
          { status: 500 }
        );
      }

      if(!error){
       try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v2/sendsms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: phoneNumber,
            nomineeName: nomineeName,
            categoryName: categoryName
          })
        });
       } catch (error) {
        console.error("Error sending SMS:", error);
       }
      }

      console.log(
        `💰 Payment received for nominee ${nomineeName}, amount: ${votesAmount}`
      );
    }
  }

  // Respond 200 OK to prevent retries
  return NextResponse.json({ status: "OK" }, { status: 200 });
}

// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   //const signature = req.headers.get('x-paystack-signature');

//   // Optionally verify signature using crypto (for security)

//   console.log("Webhook ", body)

//   console.log("custom ", body.data.metadata.custom_fields)

// //   if (body.event === 'charge.success') {
// //     //const { reference, customer, authorization, amount } = body.data;

// //     // Update DB: mark vote as paid
// //     // await supabase
// //     //   .from('votes')
// //     //   .insert({
// //     //     msisdn: customer.email.replace('user-', '').split('@')[0],
// //     //     amount,
// //     //     status: 'paid',
// //     //     reference,
// //     //     nominee_id: // You’ll need to map this somehow — maybe store ref in session or DB
// //     //   });

// //     return NextResponse.json({ received: true });
// //   }

// return new NextResponse('OK', { status: 200 });
// }
