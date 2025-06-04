"use server";

import { cache } from "react";
import { createClient } from "@/config/server";
import { Category } from "@/lib/types";

export const getCategoriesByEventId = cache(
  async (eventId: string): Promise<Category[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("category")
      .select("*")
      .eq("eventID", eventId);

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data || [];
  }
);
