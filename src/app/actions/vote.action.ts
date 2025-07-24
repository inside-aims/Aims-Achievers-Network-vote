/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/vote.ts

"use server";

import { createClient } from "@/config/server"; // Helper to get a server-side Supabase client
import { revalidatePath } from "next/cache";

interface SuccessResponse {
  success: true;
  numberOfVotes: number;
}

interface ErrorResponse {
  success: false;
  message: string;
}

export async function processVote(
  reference: string,
  nomineeId: string,
  email: string,
  phone: string,
  amountInGHS: number,
): Promise<SuccessResponse | ErrorResponse> {
  const supabase = await createClient();
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!paystackSecretKey) {
    console.error("Paystack secret key is not configured.");
    return { success: false, message: "Server configuration error. Contact support." };
  }

  try {
    // 1. Prevent duplicate votes by checking if reference already exists
    const { data: existingVote } = await supabase
      .from("vote")
      .select("id")
      .eq("referenceID", reference)
      .single();

    if (existingVote) {
      return { success: false, message: "This transaction has already been processed." };
    }

    // 2. Verify transaction with Paystack API
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${paystackSecretKey}` },
      cache: 'no-store', // Always get the latest status
    });

    if (!verifyResponse.ok) {
      return { success: false, message: "Payment verification failed." };
    }

    const verificationData = await verifyResponse.json();

    // 3. Validate payment status and amount
    if (verificationData.status !== true || verificationData.data.status !== 'success') {
      return { success: false, message: "Payment was not successful." };
    }

    const amountPaidInPesewas = verificationData.data.amount;
    const expectedAmountInPesewas = amountInGHS * 100;

    if (Math.abs(amountPaidInPesewas - expectedAmountInPesewas) > 1) {
      return { success: false, message: "Payment amount mismatch. Contact support." };
    }

    // 4. Securely determine number of votes based on event rules
    // const { data: nomineeData } = await supabase
    //   .from('nominee')
    //   .select('*, category:categoryid(*), eventId:eventId(id,name,showVote, bulkVote)')
    //   .eq('id', nomineeId)
    //   .single();

    // if (!nomineeData?.eventId) {
    //   return { success: false, message: "Could not retrieve voting rules." };
    // }
    
    // // Fetch bulk vote options for the specific event if applicable
    // const { data: bulkVoteData } = await supabase
    //     .from("bulkVotes")
    //     .select("voteOptions")
    //     .eq("eventID", eventId)
    //     .single();


    // let numberOfVotes = 0;
    // if (nomineeData.eventId.bulkVote && bulkVoteData?.voteOptions) {
    //   const votePackage = bulkVoteData.voteOptions.find(
    //     (opt: { amount: number; votes: number }) => opt.amount === amountInGHS
    //   );
    //   if (!votePackage) {
    //     return { success: false, message: `Invalid vote package for GHS ${amountInGHS}.` };
    //   }
    //   numberOfVotes = votePackage.votes;
    // } else {
    //   numberOfVotes = amountInGHS; // Default: 1 GHS = 1 vote
    // }

    // if (numberOfVotes <= 0) {
    //   return { success: false, message: "Vote amount must be greater than zero." };
    // }

    // 5. Insert the vote into the database
    const { data: newVote, error: insertError } = await supabase
      .from("vote")
      .insert({
        nomineeID: nomineeId,
        referenceID: reference,
        numberOfVotes: amountInGHS,
        phoneNumber: phone,
        email: email,
      })
      .select()
      .single();

    if (insertError) {
      console.error("CRITICAL: DB insert failed after payment verification.", insertError);
      return { success: false, message: "Failed to save vote. Contact support with payment reference." };
    }

    // Trigger SMS notification asynchronously
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/v2/sendsms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            phone: phone, 
            nomineeName: verificationData.data.metadata.custom_fields.find((f: any) => f.display_name === 'Nominee Name')?.value,
            categoryName: verificationData.data.metadata.custom_fields.find((f: any) => f.display_name === 'Category Name')?.value
        })
    }).catch(smsError => console.error('Failed to trigger SMS send:', smsError));

    revalidatePath(`/vote/${nomineeId}`);
    return { success: true, numberOfVotes: newVote.numberOfVotes };

  } catch (error) {
    console.error("An unexpected error occurred in processVote:", error);
    return { success: false, message: "An unexpected server error occurred." };
  }
}