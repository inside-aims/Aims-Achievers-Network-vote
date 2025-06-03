"use client"
import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from '@/config/client'
import { motion } from "framer-motion"
import CategoryGrid from "@/components/categories/CategoryGrid"
import { useParams } from "next/navigation"
import { Category } from "@/lib/types"
import { DotsSpinner } from "@/components/loaders/Dotspinner"


export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const eventId = params.evnid

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      const supabase = getSupabaseBrowserClient()
      
      const { data, error } = await supabase
        .from("category")
        .select("*")
        .eq("eventID", eventId)
      
      if (error) {
        console.error("Error fetching categories:", error)
      } else {
        setCategories(data || [])
      }
      setLoading(false)
    }

    if (eventId) {
      fetchCategories()
    }
  }, [eventId])

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
        {loading ? (
          <div className="text-center flex justify-center items-center py-10 ">
                        <DotsSpinner size={60}/>
                      </div>
        ) : (
          <CategoryGrid categories={categories} />
        )}
      </main>
    </div>
  )
}
