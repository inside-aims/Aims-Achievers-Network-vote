import type React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface Category {
  id: string
  name: string
  image: string
  description: string
}

interface CategoryCardProps {
  category: Category
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <motion.div
      className="bg-award-blue/10 border border-award-gold/20 rounded-lg overflow-hidden cursor-pointer h-48"
      whileHover="hover"
    >
      <motion.div className="flex h-full relative">
        <motion.div
          className="absolute inset-0"
          variants={{
            hover: { opacity: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <Image src={category.image || "/placeholder.svg"} alt={category.name} layout="fill" objectFit="cover" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex flex-col justify-center items-center p-4 bg-black bg-opacity-70"
          initial={{ opacity: 1 }}
          variants={{
            hover: { opacity: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-award-gold font-cinzel text-center">{category.name}</h2>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex flex-col justify-between p-4 bg-black bg-opacity-90"
          initial={{ opacity: 0 }}
          variants={{
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-award-gold font-cinzel">{category.name}</h2>
          <p className="text-award-silver font-poppins text-sm mb-4">{category.description}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            variants={{
              hover: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Link href={`/nominees/${category.id}`} passHref>
              <motion.a
                className="text-award-gold font-bold text-sm inline-flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                View Nominees
                <motion.span
                  className="ml-1"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  →
                </motion.span>
              </motion.a>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default CategoryCard

