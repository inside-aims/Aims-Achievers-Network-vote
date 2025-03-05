import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <motion.div
      className="relative bg-award-blue/5 border border-award-gold/10 rounded-md overflow-hidden shadow-md
                 cursor-pointer w-full md:w-80 lg:w-96 transition-all"
    >
      {/* Image Section */}
      <div className="relative w-full h-44 md:h-40 lg:h-44">
        <Image
          src={category.image || "/placeholder.svg"}
          alt={category.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-md"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 bg-black bg-opacity-80">
        <h2 className="text-lg font-semibold text-award-gold font-cinzel">
          {category.name}
        </h2>
      </div>

      {/* Hover Effect for Large Screens */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-80
                   md:opacity-0 md:hover:opacity-100 transition-opacity duration-300"
      >
        <p className="text-award-silver font-poppins text-xs mb-3 leading-tight">
          {category.description}
        </p>

        {/* View Nominees Button */}
        <Link href={`/nominees/${category.id}`}>
          <motion.button
            className="text-award-gold font-medium text-sm px-3 py-1 border border-award-gold rounded-md
                       hover:bg-award-gold hover:text-black transition-all"
          >
            View Nominees →
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default CategoryCard;
