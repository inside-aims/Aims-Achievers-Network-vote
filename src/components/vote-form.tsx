/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
// import { AnimatedGradientButton } from "@/components/ui/animation-gradient-button"
// import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { PaystackButton } from "react-paystack";

interface VoteFormProps {
  nomineeName: string;
  categoryName: string;
  shortcode: string | null;
  voteCount: number;
  showVotes: boolean;
  onSubmit: (email: string, amount: number, ref: string) => Promise<any>;
}

export function VoteForm({
  nomineeName,
  categoryName,
  shortcode,
  voteCount,
  onSubmit,
  showVotes,
}: VoteFormProps) {
  const paystack_pk = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<number>(1);
  // const [emailError, setEmailError] = useState("")
  // const [amountError, setAmountError] = useState("")
  // const [isSubmitting, setIsSubmitting] = useState(false)

  if (!paystack_pk) {
    toast.error(
      "Paystack public key is not set. Please contact support @ pycodecamp47@gmail.com."
    );
    return null;
  }

  // Form validation
  // const validateForm = () => {
  //   let isValid = true

  //   // Email validation (optional field)
  //   if (email && !/^\S+@\S+\.\S+$/.test(email)) {
  //     setEmailError("Please enter a valid email address")
  //     isValid = false
  //   } else {
  //     setEmailError("")
  //   }

  //   // Amount validation (required field)
  //   if (!amount) {
  //     setAmountError("Please enter an amount")
  //     isValid = false
  //   } else if (Number.parseInt(amount, 10) <= 0) {
  //     setAmountError("Amount must be greater than 0")
  //     isValid = false
  //   } else {
  //     setAmountError("")
  //   }

  //   return isValid
  // }

  // const handleSubmit = async () => {
  //   if (!validateForm()) return

  //   setIsSubmitting(true)
  //   try {
  //     await onSubmit(email, Number.parseInt(amount, 10))
  //   } catch (error) {
  //     console.error("Error submitting vote:", error)
  //     // Handle error state
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  const processData = async (reference: string) => {
    let vote = 0;
    try {
      const numAmount = Number(amount);
      vote = numAmount;
      // if (numAmount === 20) {
      //   vote = 60;
      // } else if (numAmount === 50) {
      //   vote = 150;
      // } else if (numAmount === 100) {
      //   vote = 350;
      // } else if (numAmount === 200) {
      //   vote = 675;
      // } else if (numAmount === 300) {
      //   vote = 1000;
      // } else {
      //   vote = numAmount * 2;
      // }

      // toast
      toast(`Initiated the ${numAmount}gh for ${vote} votes package 🎨`, {
        duration: 6000,
        position: "bottom-center",

        // styling
        className: "bg-black/60 text-white",
        style: {
          border: "1px solid #ebd534",
          padding: "16px",
          color: "#fff",
          backgroundColor: "#21211f",
        },

        // Custom Icon
        icon: "👏",
      });

      console.log("Reference: ", reference);
      // TODO: ADD TO VOTE TABLE
      const data = await onSubmit(email, vote, reference);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: email || "kvngnathan8420@gmail.com",
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
        // To pass extra metadata, add an object with the same fields as above
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
            loading: "Updating votes...",
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
    toast.error(" 🫣 Oops!! Closed Payment card!");
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
            <Input
              type="email"
              placeholder="Enter your email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border-white/10 text-white focus:border-accent-green/50"
              aria-label="Email address"
            />
            {/* {emailError && (
              <p className="text-red-500 text-sm mt-1 animate-fade-up">
                {emailError}
              </p>
            )} */}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={({ target: { value } }) => setAmount(Number(value))}
              className="w-full bg-black/30 border-white/10 text-white focus:border-accent-green/50"
              aria-label="Vote amount"
              required
            />
            {/* {amountError && (
              <p className="text-red-500 text-sm mt-1 animate-fade-up">
                {amountError}
              </p>
            )} */}
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
