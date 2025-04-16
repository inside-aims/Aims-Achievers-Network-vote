"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { AnimatedGradientButton } from "@/components/ui/animation-gradient-button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { motion } from "framer-motion"

interface VoteFormProps {
  nomineeName: string
  categoryName: string
  shortcode?: string
  voteCount: number
  onSubmit: (email: string, amount: number) => Promise<void>
}

export function VoteForm({ nomineeName, categoryName, shortcode, voteCount, onSubmit }: VoteFormProps) {
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [emailError, setEmailError] = useState("")
  const [amountError, setAmountError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    let isValid = true

    // Email validation (optional field)
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address")
      isValid = false
    } else {
      setEmailError("")
    }

    // Amount validation (required field)
    if (!amount) {
      setAmountError("Please enter an amount")
      isValid = false
    } else if (Number.parseInt(amount, 10) <= 0) {
      setAmountError("Amount must be greater than 0")
      isValid = false
    } else {
      setAmountError("")
    }

    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(email, Number.parseInt(amount, 10))
    } catch (error) {
      console.error("Error submitting vote:", error)
      // Handle error state
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-display uppercase mb-4 text-accent-green">{categoryName}</h2>

        <div className="mb-6">
          <h3 className="text-2xl font-display mb-1">{nomineeName}</h3>
          <p className="text-white/70 text-sm">{shortcode || ""}</p>
          <p className="text-accent-green text-sm mt-2">Current Votes: {voteCount}</p>
        </div>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div>
          <Input
            type="email"
            placeholder="Enter your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/30 border-white/10 text-white focus:border-accent-green/50"
            aria-label="Email address"
          />
          {emailError && <p className="text-red-500 text-sm mt-1 animate-fade-up">{emailError}</p>}
        </div>

        <div>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-black/30 border-white/10 text-white focus:border-accent-green/50"
            aria-label="Vote amount"
            required
          />
          {amountError && <p className="text-red-500 text-sm mt-1 animate-fade-up">{amountError}</p>}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <AnimatedGradientButton
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
        </AnimatedGradientButton>
      </motion.div>
    </div>
  )
}
