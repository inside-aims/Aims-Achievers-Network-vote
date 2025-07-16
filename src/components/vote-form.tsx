/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
// import { AnimatedGradientButton } from "@/components/ui/animation-gradient-button"
// import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { PaystackButton } from "react-paystack";
import { getSupabaseBrowserClient } from "@/config/client";

interface VoteFormProps {
  nomineeName: string;
  categoryName: string;
  shortcode: string | null;
  voteCount: number;
  showVotes: boolean;
  bulkVote: boolean;
  eventId: number;
  onSubmit: (
    email: string,
    phone: string,
    voteAmount: number,
    ref: string
  ) => Promise<any>;
}

export function VoteForm({
  nomineeName,
  categoryName,
  shortcode,
  voteCount,
  onSubmit,
  showVotes,
  bulkVote,
  eventId,
}: VoteFormProps) {
  const paystack_pk = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [amount, setAmount] = useState<number>(1);
  const [voteOptions, setVoteOptions] = useState<
  { amount: number; label: string; votes: number }[]
>([]);
  // const [emailError, setEmailError] = useState("")
  // const [amountError, setAmountError] = useState("")
  // const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchVoteOptions = async () => {
      if (!bulkVote) return;
  
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("bulkVotes")
        .select("voteOptions")
        .eq("eventID", eventId)
        .single();
  
      if (error) {
        console.error("Failed to fetch bulk vote options", error.message);
        return;
      }
  
      if (data?.voteOptions) {
        setVoteOptions(data.voteOptions);
      }
    };
  
    fetchVoteOptions();
  }, [bulkVote, eventId]);

  if (!paystack_pk) {
    toast.error(
      "Paystack public key is not set. Please contact support @ a.i.m.s582024@gmail.com."
    );
    return null;
  }

  const validatePhone = (phoneNumber: string): boolean => {
    // Remove any non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    // Check if it's exactly 10 digits and starts with 0 or 233
    const isValid = /^(0|233)\d{9,10}$/.test(digitsOnly);

    if (!isValid) {
      setPhoneError(
        "Please enter a valid 10-digit phone number (e.g., 0551234567)"
      );
      return false;
    }

    setPhoneError("");
    return true;
  };

  const processData = async (reference: string) => {
    if (!validatePhone(phone)) {
      return;
    }

    let vote = 0;
    try {
      const numAmount = Number(amount);
      if (bulkVote) {
        const selected = voteOptions.find((opt) => opt.amount === numAmount);
        vote = selected?.votes ?? 0;
        console.log(vote);
      } else {
        vote = numAmount;
      }
      

      // toast
      // toast(`Initiated the ${numAmount}gh for ${vote} votes package 🎨`, {
      //   duration: 6000,
      //   position: "bottom-center",

      //   // styling
      //   className: "bg-black/60 text-white",
      //   style: {
      //     border: "1px solid #ebd534",
      //     padding: "16px",
      //     color: "#fff",
      //     backgroundColor: "#21211f",
      //   },

      //   // Custom Icon
      //   icon: "👏",
      // });


      try {
        const data = await onSubmit(email, phone, vote, reference);

        // Send SMS after successful vote
        try {
          await fetch('/api/v2/sendsms', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone: phone,
              nomineeName: nomineeName,
              categoryName: categoryName
            })
          });

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

        } catch (smsError) {
          console.error('Failed to send SMS:', smsError);
          // Don't fail the whole process if SMS fails
        }

        return data;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: email || `${phone}@gmail.com`,
    amount: amount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: paystack_pk,
    currency: "GHS",
    metadata: {
      custom_fields: [
        {
          display_name: "Nominee Code",
          variable_name: "Nominee Code",
          value: shortcode,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: phone,
        },
      ],
    },
  };

  // you can call this function anything
  const onSuccess = (paystackData: any) => {
    // Implementation for whatever you want to do with reference and after success call.
    if (paystackData.status === "success") {
      toast.success("Payment successful 👍");
      toast
        .promise(
          processData(paystackData.reference),
          {
            loading: "Processing your vote...",
            success: (data) =>
              `Successfully voted ${data?.numberOfVotes || "N/A"} votes!`,
            error: (err) =>
              `Vote update failed: ${err.toString()}. Contact support immediately @ 0558218741`,
          },
          {
            style: {
              minWidth: "250px",
            },
            success: {
              duration: 5000,
              icon: "🔥",
            },
          }
        )
        .then(() => {
          setAmount(1);
        });
    }
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    toast.error(` 🫣 Oops!! Closed Payment card!`);
    router.refresh();
  };

  const componentProps = {
    ...config,
    text: `Pay GHS ${Number(amount) || 0}`,
    onSuccess: (data: any) => onSuccess(data),
    onClose: onClose,
  };

  const displayVotes = showVotes ? voteCount.toString() : "********";

  return (
    <div className="max-w-md md:max-w-lg lg:max-w-xl mx-auto p-4 md:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg md:text-xl lg:text-2xl font-display uppercase mb-3 text-accent-green">
          {categoryName}
        </h2>

        <div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-display mb-1">
            {nomineeName}
          </h3>

          <p className="text-white/70 text-xs md:text-sm">{shortcode || ""}</p>
          <p className="text-accent-green text-sm md:text-base mt-2">
            Current Votes: {displayVotes}
          </p>
        </div>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email (Optional)
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-award-gold focus:border-gray-400/30"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                // Clear error when user starts typing
                if (phoneError) setPhoneError("");
              }}
              onBlur={() => validatePhone(phone)}
              placeholder="0551234567"
              required
              className={`bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-award-gold focus:border-gray-400/30 ${
                phoneError ? "border-red-500" : ""
              }`}
            />
            {phoneError && (
              <p className="mt-1 text-sm text-red-500">{phoneError}</p>
            )}
          </div>

          <div>
  <label
    htmlFor="amount"
    className="block text-sm font-medium text-gray-300 mb-1"
  >
    {bulkVote ? "Select Your Vote Package" : "Amount (GHS)"}
    <span className="text-red-500">*</span>
  </label>

  {bulkVote ? (
    <Select
      value={amount.toString()}
      onValueChange={(val) => setAmount(Number(val))}
    >
      <SelectTrigger className="w-full bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-award-gold focus:border-gray-400/30">
        <SelectValue placeholder="Select Your Package" />
      </SelectTrigger>
      <SelectContent className="bg-black text-white">
        {voteOptions.map((option) => (
          <SelectItem key={option.amount} value={option.amount.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <Input
      id="amount"
      type="number"
      min="1"
      value={amount}
      onChange={({ target: { value } }) => setAmount(Number(value))}
      className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-award-gold focus:border-gray-400/30"
      required
    />
  )}
</div>

        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* <AnimatedGradientButton
          onClick={handleSubmit}
          variant="secondary"
          size="lg"
          glowing={true}
          className="w-full md:w-auto mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            `Vote for ${nomineeName}`
          )}
        </AnimatedGradientButton> */}
        <PaystackButton
          className="font-semibold  border-none px-8 py-2 bg-blue-500 hover:bg-blue-400 rounded-full w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-25 mb-5"
          {...componentProps}
        />
      </motion.div>
    </div>
  );
}
