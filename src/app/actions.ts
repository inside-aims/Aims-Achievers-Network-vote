/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cache } from "react";
import { createClient } from "@/config/server";
import { Category, Nominee } from "@/lib/types";

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

export const getNomineesByCategoryId = cache(
  async (categoryId: string): Promise<Nominee[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("nominee")
      .select(
        `
        *,
        vote:vote(numberOfVotes),
        eventId:event(showVote)
      `
      )
      .eq("categoryid", categoryId)
      .eq("approved", true);

    if (error) {
      console.error("Error fetching nominees:", error);
      return [];
    }

    // Process the data to include calculated votes and showVote flag
    return (data || []).map((nominee) => ({
      ...nominee,
      showVote: (nominee.eventId as any)?.showVote || false,
      votes: (nominee.vote || []).reduce(
        (sum: number, vote: { numberOfVotes: number }) =>
          sum + (vote.numberOfVotes || 0),
        0
      ),
    }));
  }
);
