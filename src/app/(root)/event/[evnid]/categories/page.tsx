"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CategoryGrid from "@/components/categories/CategoryGrid";
import { useParams } from "next/navigation";
import { DotsSpinner } from "@/components/loaders/Dotspinner";
import { getCategoriesByEventId } from "@/app/actions";
import { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const eventId = params.evnid as string;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!eventId) return;

      setLoading(true);
      try {
        const data = await getCategoriesByEventId(eventId);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [eventId]);

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
          <div className="text-center flex justify-center items-center py-10">
            <DotsSpinner size={60} />
          </div>
        ) : (
          <CategoryGrid categories={categories} />
        )}
      </main>
    </div>
  );
}
