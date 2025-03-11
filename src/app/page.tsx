"use client"
import { useEffect, useState } from "react"
import { createClient } from '@/config/client'
import { motion } from "framer-motion"
import CategoryGrid from "@/components/categories/CategoryGrid"

const supabase = createClient()

export default function Home() {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {

    (async () => {
        const { data, error } = await supabase.from("category").select("*")
        if (error) {
          console.error("Error fetching categories:", error)
        } else {
          setCategories(data || [])
        }
      }
    )()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-900">
      <main className="container mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl text-center text-award-gold mb-12 font-cinzel"
        >
          Award Categories
        </motion.h1>
        <CategoryGrid categories={categories} />
      </main>
    </div>
  )
}
