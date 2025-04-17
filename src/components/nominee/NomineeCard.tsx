"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

interface NomineeCardProps {
  nominee: {
    id: string
    name: string
    image?: string
    shortcode?: string
    votes: number
  }
}

const NomineeCard: React.FC<NomineeCardProps> = ({ nominee }) => {
  const router = useRouter()
  const [showVotes, setShowVotes] = useState(false)

  // Handle case when nominee is undefined
  if (!nominee) {
    return (
      <Card className="relative aspect-[1.58/1] bg-black text-white overflow-hidden">
        <div className="absolute inset-0 p-6 flex items-center justify-center">
          <p>Nominee information unavailable</p>
        </div>
      </Card>
    )
  }

  const { id, name, image, shortcode, votes = 0 } = nominee

  const toggleVotesVisibility = () => {
    setShowVotes(!showVotes)
  }

  const displayVotes = showVotes ? votes.toString() : "********"

  return (
    <Card className="relative aspect-[1.58/1] bg-black text-white overflow-hidden">
      <div className="absolute inset-0 p-6 flex flex-col">
        <div className="flex gap-6 h-full">
          {/* Left section with image */}
          <div className="w-[45%] bg-zinc-200">
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt=""
                className="h-full w-full object-cover object-top"
                height={200}
                width={200}
              />
            </div>
          </div>

          {/* Right section with red accent */}
          <div className="relative flex-1">
            {/* Red geometric accent */}
            <div className="absolute right-0 top-0 w-24 h-24 bg-zinc-100/30" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="space-y-1">
                <h3 className="text-2xl font-medium tracking-tight">{name}</h3>
                <p className="text-sm text-award-gold">{shortcode || "Nominee"}</p>
              </div>

              {/* Eye icon to toggle votes visibility */}
              <div className="text-[12px] flex items-center gap-2">
                <button
                  onClick={toggleVotesVisibility}
                  className="text-zinc-400 hover:text-award-gold transition-colors"
                  aria-label={showVotes ? "Hide votes" : "Show votes"}
                >
                  {showVotes ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <span className="text-zinc-400">Votes</span>
              </div>

              {/* Bottom section with logo and website */}
              <div className="space-y-3">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" className="text-zinc-100/30" fill="currentColor">
                    <path d="M12 2L2 19.7778H22L12 2Z" />
                  </svg>
                </div>

                <motion.button
                  className="absolute text-award-gold font-medium text-sm px-3 py-1 border border-award-gold rounded-md
                       hover:bg-award-gold hover:text-black transition-all right-0 bottom-5"
                  onClick={() => router.push(`/vote/${id}`)}
                >
                  Vote
                </motion.button>

                {/* Votes count (either shown or hidden) */}
                <p className="text-xs text-zinc-400">{displayVotes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default NomineeCard
