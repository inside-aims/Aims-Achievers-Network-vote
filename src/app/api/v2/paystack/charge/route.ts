import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { msisdn, provider = 'mtn', amount, nomineeId, userId, votesAmount, nomineeName } = await req.json();

  if (!msisdn || !amount || !nomineeId) {
    console.log("Missing required fields")
    return NextResponse.json({ status: false, message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const paystackRes = await fetch('https://api.paystack.co/charge', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount, // e.g., 10000 for GHS 100
        email: `kvngnathan8420@gmail.com`,
        currency: 'GHS',
        mobile_money: {
          phone: msisdn,
          provider,
        },
        metadata: {
            custom_fields: [
              {
                display_name: "Nominee ID",
                variable_name: "nominee_id",
                value: nomineeId
              },
              {
                display_name: "User ID",
                variable_name: "user_id",
                value: userId
              },
              {
                display_name: "Votes Amount",
                variable_name: "votes_amount",
                value: votesAmount
              },
              {
                display_name: "Phone Number",
                variable_name: "phone_number",
                value: msisdn
              },
              {
                display_name: "Nominee Name",
                variable_name: "nominee_name",
                value: nomineeName
              }
            ]
          },
      }),
    });

    const paystackData = await paystackRes.json();

    console.log("Charge Data ", paystackData)
    // Optionally store reference and nominee ID in DB or cache here
    // For example, insert into a "pending_payments" table

    return NextResponse.json(paystackData);
  } catch (error) {
    console.error('Paystack charge error:', error);
    return NextResponse.json({ status: false, message: 'Charge failed' }, { status: 500 });
  }
}
