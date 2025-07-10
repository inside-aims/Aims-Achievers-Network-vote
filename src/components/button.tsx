import { motion } from "framer-motion";

export default function AwardButton() {
  return (
    <motion.button
      className="relative px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full shadow-lg hover:shadow-yellow-500/50 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10">Nominate Now</span>
      <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 rounded-full"></div>
    </motion.button>
  );
}