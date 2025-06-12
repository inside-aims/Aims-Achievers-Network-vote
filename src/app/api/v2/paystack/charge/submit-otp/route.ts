import { NextResponse } from "next/server";

// Define the expected request body type
interface SubmitOtpRequest {
  otp: string;
  reference: string;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { otp, reference } = (await request.json()) as SubmitOtpRequest;

    if (!otp || !reference) {
      return NextResponse.json(
        { status: false, message: "OTP and reference are required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.paystack.co/charge/submit_otp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp,
        reference,
      }),
    });

    const data = await response.json();
    console.log("Submit OTP Data ", data)

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: data.message || "Failed to submit OTP" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      status: true,
      message: "OTP submitted successfully",
      data,
    });
  } catch (error) {
    console.error("Error submitting OTP:", error);
    return NextResponse.json(
      {
        status: false,
        message: "An error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}
