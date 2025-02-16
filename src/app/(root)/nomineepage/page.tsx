"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/nominee/Header"
import { NomineeCard } from "@/components/nominee/NomineeCard"

const nominees = [
  {
    name: "Ada Balogun",
    role: "Lead Marketer",
    image: "/assets/images/nominee/nom-1.webp",
    website: "www.torlago.com",
    position: "top"
  },
  {
    name: "Sarah Chen",
    role: "Senior Developer",
    image: "/assets/images/nominee/nom-2.webp",
    website: "www.torlago.com",
  },
  {
    name: "James Wilson",
    role: "Product Designer",
    image: "/assets/images/nominee/nom-3.webp",
    website: "www.torlago.com",
  },
]

export default function NomineesPage() {
  return (
    <div className="min-h-screen bg-zinc-100 py-16">
      <Header />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4">
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
    </div>
  )
}

