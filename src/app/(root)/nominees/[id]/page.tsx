"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Header } from "@/components/nominee/Header"
import { NomineeCard } from "@/components/nominee/NomineeCard"
import { Button } from "@/components/ui/nomineebutton"
import NominationModal from "@/components/nominee/NominationModal"
import Link from "next/link"

const nominees = [
  {
    name: "Ada Balogun",
    role: "Lead Marketer",
    image: "/assets/images/nominee/nom-1.webp",
    website: "www.torlago.com",
    position: "top",
    category: "Best Innovator",
  },
  {
    name: "Sarah Chen",
    role: "Senior Developer",
    image: "/assets/images/nominee/nom-2.webp",
    website: "www.torlago.com",
    category: "Best Innovator",
  },
  {
    name: "James Wilson",
    role: "Product Designer",
    image: "/assets/images/nominee/nom-3.webp",
    website: "www.torlago.com",
    category: "Best Innovator",
  },
]

export default function NomineesPage() {
  const [isOpen, setIsOpen] = useState(false) // Track modal state

  return (
    <div className="min-h-screen bg-zinc-100 text-white">
      <main className="py-16">
        <Header />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
      {/* Nominate Button */}
      <Button className="bg-award-gold text-black px-6 py-3 rounded mb-10" onClick={() => setIsOpen(true)}>
        Nominate Someone
      </Button>

      {/* Show Modal Only When isOpen is True */}
      {isOpen && <NominationModal setIsOpen={setIsOpen} />}
    </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {nominees.map((nominee, index) => (
              <motion.div
                key={nominee.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <NomineeCard {...nominee} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

