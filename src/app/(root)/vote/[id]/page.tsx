"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useParams } from "next/navigation"
import { VoteButton } from "@/components/ui/votebutton"
import { Input } from "@/components/ui/input"
import { Twitter, Facebook, Linkedin, PhoneIcon as WhatsApp, CheckCircle, ArrowLeft } from "lucide-react"

// Mock data for demonstration
const nominees = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    category: "Best Innovator of the Year",
    image: "/placeholder.svg",
    description: "Pioneering researcher in quantum computing",
    voteCount: 1500,
  },
  // Add more nominees as needed
]

const VotePage: React.FC = () => {
  const { id } = useParams()
  const nominee = nominees.find((n) => n.id === id) || nominees[0] // Fallback to first nominee if not found
  const [isVoted, setIsVoted] = useState(false)
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")

  const handleVote = () => {
    // Here you would typically send the vote to your backend
    setIsVoted(true)
  }

  const shareUrl = `https://yourdomain.com/vote/${nominee.id}`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-[#0D0D1F] via-[#1A1A3A] to-[#2D2D5A] text-white flex items-center justify-center p-4"
    >
      <div className="max-w-4xl w-full">
        <AnimatePresence mode="wait">
          {!isVoted ? (
            <motion.div
              key="vote-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-award-blue/10 border border-award-gold/20 rounded-lg p-8 shadow-lg"
            >
              <h1 className="text-3xl md:text-4xl text-award-gold mb-4 font-cinzel">{nominee.category}</h1>
              <p className="text-award-silver mb-6 font-poppins">Select your nominee and confirm your choice!</p>

              <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                <motion.div
                //   whileHover={{ scale: 1.05 }}
                //   whileTap={{ scale: 0.95 }}
                  className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-award-gold"
                >
                  <Image src={nominee.image || "/placeholder.svg"} alt={nominee.name} layout="fill" objectFit="cover" />
                </motion.div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl text-award-gold mb-2 font-cinzel">{nominee.name}</h2>
                  <p className="text-award-silver mb-4 font-poppins">{nominee.description}</p>
                  <p className="text-sm text-award-silver mb-2 font-poppins">Current Votes: {nominee.voteCount}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 border-award-gold/20 text-white"
                />
                <Input
                  type="number"
                  placeholder="Enter amount (optional)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-black/50 border-award-gold/20 text-white"
                />
              </div>

              <VoteButton
                onClick={handleVote}
                className="w-full bg-award-gold hover:bg-award-gold/80 text-black py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Vote for {nominee.name}
              </VoteButton>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-award-blue/10 border border-award-gold/20 rounded-lg p-8 shadow-lg text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold text-award-gold mb-4 font-cinzel">Thank you for voting!</h2>
              <p className="text-xl text-award-silver mb-6 font-poppins">
                You voted for {nominee.name} in the category: {nominee.category}
              </p>
              <div className="flex justify-center space-x-4 mb-8">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={`https://twitter.com/intent/tweet?text=I just voted for ${nominee.name} in the ${nominee.category} category!&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-award-gold hover:text-award-gold/80"
                >
                  <Twitter />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-award-gold hover:text-award-gold/80"
                >
                  <Facebook />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-award-gold hover:text-award-gold/80"
                >
                  <Linkedin />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={`https://wa.me/?text=I just voted for ${nominee.name} in the ${nominee.category} category! ${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-award-gold hover:text-award-gold/80"
                >
                  <WhatsApp />
                </motion.a>
              </div>
              <VoteButton
                onClick={() => window.history.back()}
                className="bg-award-gold hover:bg-award-gold/80 text-black font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                <ArrowLeft className="mr-2" /> Return to Nominees
              </VoteButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default VotePage

