"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/config/client";
// import { ChevronDown } from 'lucide-react'
import { GlassCard } from "@/components/ui/glass-card";
import { AccentBlock } from "@/components/ui/accent-block";
import { FuturisticButton } from "@/components/ui/futuristic-button";
import { VoteForm } from "@/components/vote-form";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";
import { NomineeWithDetails } from "@/lib/types";
import { DotsSpinner } from "@/components/loaders/Dotspinner";

export default function VotePage() {
  const [nominee, setNominee] = useState<NomineeWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVoted, setIsVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchNomineeData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const supabase = getSupabaseBrowserClient();

        // Fetch nominee with related category data
        const { data: nomineeData, error: nomineeError } = await supabase
          .from("nominee")
          .select(
            "*, category:categoryID(*), eventId:eventId(id,name,showVote, bulkVote)"
          )
          .eq("id", id)
          .single();

        if (nomineeError) {
          throw new Error(nomineeError.message);
        }

        if (nomineeData) {
          console.log(nomineeData);
          setNominee(nomineeData as NomineeWithDetails);

          // Fetch vote count for this nominee - sum the numberOfVotes
          const { data: voteData, error: voteError } = await supabase
            .from("vote")
            .select("numberOfVotes")
            .eq("nomineeID", id);

          if (voteError) {
            console.error("Error fetching votes:", voteError);
          } else if (voteData) {
            // Calculate the sum of all numberOfVotes
            const totalVotes = voteData.reduce(
              (sum, vote) => sum + (vote.numberOfVotes || 0),
              0
            );
            setVoteCount(totalVotes);
          }
        }
      } catch (err) {
        console.error("Error in data fetching:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNomineeData();
  }, [id]);

  const handleVote = async (
    email: string,
    phone: string,
    voteAmount: number,
    ref: string
  ) => {
    if (!nominee) return;

    try {
      const supabase = getSupabaseBrowserClient();

      // Record the vote
      const { data, error } = await supabase
        .from("vote")
        .insert({
          nomineeID: nominee.id,
          referenceID: ref,
          numberOfVotes: voteAmount,
          phoneNumber: phone,
          email: email,
        })
        .select() // Add .select() here to return the inserted row(s)
        .single(); // Use .single() if you expect only one row to be inserted and returned

      if (error) {
        throw new Error(error.message);
      }

      setIsVoted(true);
      // Update the vote count by adding the new votes
      setVoteCount((prevCount) => prevCount + voteAmount);

      return data; // Return the data if needed further in the cod
      // Could add analytics event here
    } catch (err) {
      console.error("Error recording vote:", err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center flex justify-center items-center py-10 ">
            <DotsSpinner size={60} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !nominee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 max-w-md">
          <div className="text-xl text-center mb-4">
            {error || "Nominee not found"}
          </div>
          <FuturisticButton
            onClick={() => router.push("/")}
            className="w-full"
            variant="secondary"
          >
            Return Home
          </FuturisticButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-20 sm:p-6 md:p-8 overflow-hidden">
      {/* Logo and Navigation */}
      <header className="absolute top-0 left-0 w-full z-10 p-3 sm:p-4 md:p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* Header content removed as per your modification */}
            <FuturisticButton
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-medium text-award-gold hover:text-sky-100 transition duration-200"
              variant="secondary"
            >
              back to nominees
            </FuturisticButton>
          </div>
        </div>
      </header>

      {/* Accent Blocks */}
      <AccentBlock position="top-right" color="rgba(0, 255, 128, 0.15)" />
      <AccentBlock position="bottom-left" color="rgba(0, 255, 128, 0.1)" />
      <AccentBlock
        position="custom"
        customStyle={{
          top: "30%",
          right: "15%",
          width: "200px",
          height: "300px",
          backgroundColor: "rgba(0, 255, 128, 0.05)",
        }}
      />

      {/* Scroll Indicator */}
      {/* <div className="hidden md:flex absolute right-6 bottom-12 flex-col items-center space-y-2 text-xs tracking-widest font-display rotate-90 origin-bottom-right">
        <span className="text-white/70">Scroll down</span>
        <ChevronDown className="w-4 h-4 text-accent-green -rotate-90" />
      </div> */}

      {/* Main Content */}
      <div className="max-w-6xl w-full z-10">
        <AnimatePresence mode="wait">
          {!isVoted ? (
            <motion.div
              key="vote-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Left Column - Title and Form */}
                <div className="flex flex-col justify-center">
                  <motion.h1
                    className="font-display text-3xl sm:text-4xl md:text-5xl mb-2 tracking-wider uppercase text-gradient"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {nominee.eventId.name}
                    {/* <br className="md:block hidden" /> */}
                    {/* <span className="md:inline">AWARDS</span> */}
                  </motion.h1>

                  <motion.p
                    className="text-white/70 mb-8 max-w-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Vote for your favorite style nominee and help them win the
                    prestigious award.
                  </motion.p>

                  <GlassCard className="p-4 sm:p-6 mb-6">
                    <VoteForm
                      nomineeName={nominee.name}
                      categoryName={nominee.category.name}
                      shortcode={nominee.shortcode}
                      voteCount={voteCount}
                      onSubmit={handleVote}
                      showVotes={nominee.eventId.showVote}
                    />
                  </GlassCard>
                </div>

                {/* Right Column - Image */}
                <motion.div
                  className="relative flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="relative w-full z-50 flex items-center justify-center">
                    {/* Small screen circular image with gold border */}
                    <div className="sm:hidden relative w-64 h-64 rounded-full overflow-hidden border-4 border-amber-500 shadow-lg mx-auto">
                      <Image
                        src={
                          nominee.image ||
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-15%20160359-ygC5ECiyj1PkRod9z1lMsOljf1tpMg.png" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={nominee.name}
                        fill
                        className="object-cover"
                        sizes="256px"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                    </div>

                    {/* Medium and large screen rectangular image */}
                    <div className="hidden sm:block relative w-full aspect-[4/5] md:aspect-auto md:h-[700px] overflow-hidden rounded-lg bg-gradient">
                      <div className="hidden md:block absolute w-full h-full grid grid-cols-3 grid-rows-3 gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl"></div>
                      <Image
                        src={
                          nominee.image ||
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-15%20160359-ygC5ECiyj1PkRod9z1lMsOljf1tpMg.png" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={nominee.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-50" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ConfirmationScreen
                nomineeName={nominee.name}
                categoryName={nominee.category.name}
                onReturn={() => router.back()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
