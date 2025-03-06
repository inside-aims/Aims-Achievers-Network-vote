import { motion } from "framer-motion"

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto text-center mb-16"
    >
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-zinc-900 mb-4">Award Nominees 2024</h1>
      <p className="text-lg text-zinc-600">Celebrating excellence and innovation in our industry</p>
    </motion.header>
  )
}

