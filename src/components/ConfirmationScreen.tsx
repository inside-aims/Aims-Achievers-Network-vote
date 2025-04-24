"use client"

import { motion } from "framer-motion"
import { Twitter, Facebook, Linkedin, PhoneIcon as WhatsApp, CheckCircle, ArrowLeft } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { FuturisticButton } from "@/components/ui/futuristic-button"

interface ConfirmationScreenProps {
  nomineeName: string
  categoryName: string
  onReturn: () => void
}

export function ConfirmationScreen({ nomineeName, categoryName, onReturn }: ConfirmationScreenProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <GlassCard className="p-8 text-center max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
      >
        <CheckCircle className="w-24 h-24 text-accent-green mx-auto mb-6" />
      </motion.div>

      <h2 className="text-3xl font-display uppercase text-gradient mb-4">Thank you for voting!</h2>

      <p className="text-xl text-white/80 mb-8">
        You voted for <span className="text-accent-green">{nomineeName}</span> in the category: {categoryName}
      </p>

      <div className="flex justify-center space-x-6 mb-8">
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href={`https://twitter.com/intent/tweet?text=I just voted for ${nomineeName} in the ${categoryName} category!&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 hover:text-accent-green transition-colors"
        >
          <Twitter className="w-5 h-5" />
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 hover:text-accent-green transition-colors"
        >
          <Facebook className="w-5 h-5" />
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 hover:text-accent-green transition-colors"
        >
          <Linkedin className="w-5 h-5" />
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href={`https://wa.me/?text=I just voted for ${nomineeName} in the ${categoryName} category! ${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/70 hover:text-accent-green transition-colors"
        >
          <WhatsApp className="w-5 h-5" />
        </motion.a>
      </div>

      <FuturisticButton onClick={onReturn} variant="outline" size="lg">
        <ArrowLeft className="mr-2 w-4 h-4" /> Return to Nominees
      </FuturisticButton>
    </GlassCard>
  )
}
