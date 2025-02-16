"use client"

import { motion } from "framer-motion"
import CategoryGrid from "@/components/categories/CategoryGrid"
import { categories } from "@/data/categories"


export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#000000] to-[#2e2701] text-white">
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

