"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/nominee/Header"
import { NomineeCard } from "@/components/nominee/NomineeCard"
import { Button } from "@/components/ui/nomineebutton"
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
  return (
    <div className="min-h-screen bg-zinc-100 text-white">
      <main className="py-16">
        <Header />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
            <Link href="/nominate/best-innovator" passHref>
              <Button className="bg-award-gold text-black hover:bg-award-gold/80 font-bold py-2 px-4 rounded">
                Nominate Someone
              </Button>
            </Link>
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

