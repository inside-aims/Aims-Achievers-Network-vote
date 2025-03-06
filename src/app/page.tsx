"use client"

import { motion } from "framer-motion"
import CategoryGrid from "@/components/categories/CategoryGrid"
import { categories } from "@/data/categories"

export default function Home() {
  return (
<>
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
</>
  );
}
