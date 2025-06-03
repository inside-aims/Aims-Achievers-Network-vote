import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phone, nomineeName, categoryName } = await request.json();

    const smsData = {
      sender: "AIMSNetwork",
      message: `Thank you for voting for ${nomineeName} in the ${categoryName} category. Your vote has been recorded successfully!`,
      recipients: [phone],
    };

    const response = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.ARKESEL_API_KEY || "",
      },
      body: JSON.stringify(smsData),
    });

    console.log("Response: ", response);

    const responseBody = await response.json();
    console.log("Response Body: ", responseBody);
    /*
          Response Body:  {
  data: [
    {
      id: '35a9c370-31ff-432a-8295-5745b0cdfd09',
      recipient: '233558218741'
    }
  ],
  status: 'success'
}
          */

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${JSON.stringify(responseBody)}`
      );
    }
    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
