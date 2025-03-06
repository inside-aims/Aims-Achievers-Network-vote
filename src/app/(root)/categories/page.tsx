"use client"

import { motion } from "framer-motion"
import CategoryGrid from "@/components/categories/CategoryGrid"
import { categories } from "@/data/categories"

export default function CategoryPage() {
  return (
    <section className="min-h-screen bg-gray-950 text-white">
      <main className="container mx-auto max-w-6xl px-4 py-16">
        
        {/* Page Title with Motion Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl text-center text-award-gold mb-12 font-cinzel"
          aria-label="Award Categories"
        >
          Award Categories
        </motion.h1>

        {/* Category Grid */}
        <CategoryGrid categories={categories} />
      </main>
    </section>
  )
}
