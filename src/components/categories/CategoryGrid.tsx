import type React from "react"
import { motion } from "framer-motion"
import CategoryCard from "./CategoryCards"
import { CategoryGridProps } from "@/lib/types"

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {categories?.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <CategoryCard category={category} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default CategoryGrid

