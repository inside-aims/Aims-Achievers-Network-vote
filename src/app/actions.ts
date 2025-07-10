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

export async function fetchNomineesWithVotes(eventId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('nominee')
    .select(`
      id,
      name,
      stage_name,
      image,
      category:categoryid (
        id,
        name
      ),
      votes:vote (
        numberOfVotes
      )
    `)
    .eq('eventId', eventId)
    .eq('approved', true)

  if (error) throw error
  
  return data?.map(nominee => ({
    ...nominee,
    totalVotes: nominee.votes.reduce((sum, vote) => sum + (vote.numberOfVotes || 0), 0)
  })).sort((a, b) => b.totalVotes - a.totalVotes) || []
}

export async function fetchCategoriesWithNominees(eventId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('category')
    .select(`
      id,
      name,
      nominees:nominee!categoryid (
        id,
        name,
        stage_name,
        image,
        votes:vote (
          numberOfVotes
        )
      )
    `)
    .eq('eventID', eventId)

  if (error) throw error
  
  return data?.map(category => ({
    id: category.id,
    name: category.name,
    votes: category.nominees.reduce((sum, nominee) => 
      sum + nominee.votes.reduce((voteSum, vote) => voteSum + (vote.numberOfVotes || 0), 0), 0
    ),
    nominees: category.nominees.map(nominee => ({
      id: nominee.id,
      name: nominee.name,
      stage_name: nominee.stage_name,
      image: nominee.image,
      category: { id: category.id, name: category.name },
      totalVotes: nominee.votes.reduce((sum, vote) => sum + (vote.numberOfVotes || 0), 0)
    })).sort((a, b) => b.totalVotes - a.totalVotes)
  })) || []
}
