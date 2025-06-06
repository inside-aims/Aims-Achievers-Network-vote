import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  //const signature = req.headers.get('x-paystack-signature');

  // Optionally verify signature using crypto (for security)

  console.log("Webhook ", body)
  
  console.log("custom ", body.data.metadata.custom_fields)

//   if (body.event === 'charge.success') {
//     //const { reference, customer, authorization, amount } = body.data;

//     // Update DB: mark vote as paid
//     // await supabase
//     //   .from('votes')
//     //   .insert({
//     //     msisdn: customer.email.replace('user-', '').split('@')[0],
//     //     amount,
//     //     status: 'paid',
//     //     reference,
//     //     nominee_id: // You’ll need to map this somehow — maybe store ref in session or DB
//     //   });

//     return NextResponse.json({ received: true });
//   }

return new NextResponse('OK', { status: 200 });
}
