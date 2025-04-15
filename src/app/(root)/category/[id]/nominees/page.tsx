"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Header } from "@/components/nominee/Header"
import NomineeCard from "@/components/nominee/NomineeCard"
import { Button } from "@/components/ui/nomineebutton"
import NominationModal from "@/components/nominee/NominationModal"
import { getSupabaseBrowserClient } from "@/config/client"
import { useParams } from "next/navigation"
import { Nominee } from "@/lib/types"

export default function NomineesPage() {
  const [nominees, setNominees] = useState<Nominee[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false) // Track modal state
  const params = useParams()
  const categoryId = params.id as string

  useEffect(() => {
    const fetchNominees = async () => {
      setLoading(true)
      const supabase = getSupabaseBrowserClient()
      
      const { data, error } = await supabase
        .from("nominee")
        .select("*")
        .eq("categoryID", categoryId)
      
      if (error) {
        console.error("Error fetching nominees:", error)
      } else {
        setNominees(data || [])
      }
      setLoading(false)
    }

    if (categoryId) {
      fetchNominees()
    }
  }, [categoryId])

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <main className="py-16">
        <Header />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            {/* Nominate Button */}
            <Button className="bg-award-gold text-black px-6 py-3 rounded mb-10" onClick={() => setIsOpen(true)}>
              Nominate Someone
            </Button>

            {/* Show Modal Only When isOpen is True */}
            {isOpen && <NominationModal setIsOpen={setIsOpen} categoryId={categoryId} />}
          </div>
          
          {loading ? (
            <div className="text-center py-10 text-white">
              <p>Loading nominees...</p>
            </div>
          ) : nominees.length === 0 ? (
            <div className="text-center py-10 text-black">
              <p>No nominees found for this category.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {nominees.map((nominee, index) => (
                <motion.div
                  key={nominee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <NomineeCard nominee={nominee} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

