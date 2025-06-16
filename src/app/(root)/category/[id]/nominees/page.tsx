"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Header } from "@/components/nominee/Header";
import NomineeCard from "@/components/nominee/NomineeCard";
//import { Button } from "@/components/ui/nomineebutton"
import NominationModal from "@/components/nominee/NominationModal";
import { useParams, useRouter } from "next/navigation";
import { Nominee } from "@/lib/types";
import VerifyModal from "@/components/nominee/VerifyModal";
import { DotsSpinner } from "@/components/loaders/Dotspinner";
import { getNomineesByCategoryId } from "@/app/actions";
import { FuturisticButton } from "@/components/ui/futuristic-button";

export default function NomineesPage() {
  const router = useRouter();
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyingNominee, setVerifyingNominee] = useState<Nominee | null>(
    null
  );
  const params = useParams();
  const categoryId = params.id as string;

  useEffect(() => {
    const fetchNominees = async () => {
      if (!categoryId) return;

      setLoading(true);
      try {
        const data = await getNomineesByCategoryId(categoryId);
        setNominees(data);
      } catch (error) {
        console.error("Error fetching nominees:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchNominees();
    }
  }, [categoryId]);

  const handleRequestVerification = (nominee: Nominee) => {
    setVerifyingNominee(nominee);
    setVerifyModalOpen(true);
  };

  const handleVerifySuccess = () => {
    if (!verifyingNominee) return;

    setNominees((prevNominees) =>
      prevNominees.map((n) =>
        n.id === verifyingNominee.id ? { ...n, showVote: true } : n
      )
    );
    setVerifyModalOpen(false);
    setVerifyingNominee(null);
  };

  const handleVerifyCancel = () => {
    setVerifyModalOpen(false);
    setVerifyingNominee(null);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <main className="py-10">
        <div>
          <FuturisticButton
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-award-gold hover:text-sky-100 transition duration-200 ml-1"
            variant="secondary"
          >
            <span className="hidden md:block">Back to Categories</span>
            <span className="md:hidden">Back</span>
          </FuturisticButton>
          <Header />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4"
        >
          <div className="flex flex-col items-center justify-center">
            {/* Nominate Button */}
            {/* <Button disabled className="bg-award-gold text-black px-6 py-3 rounded mb-10" onClick={() => setIsOpen(true)}>
              Nominate Someone
            </Button> */}

            {/* Show Modal Only When isOpen is True */}
            {isOpen && (
              <NominationModal setIsOpen={setIsOpen} categoryId={categoryId} />
            )}
          </div>

          {loading ? (
            <div className=" flex justify-center items-center py-10 ">
              <DotsSpinner size={60} />
            </div>
          ) : nominees.length === 0 ? (
            <div className="text-center py-10 text-black">
              <p>No nominees found for this category.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {nominees.map((nominee, index) => (
                <motion.div
                  key={nominee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <NomineeCard
                    nominee={nominee}
                    showVotes={nominee.showVote}
                    onRequestVerification={handleRequestVerification}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      {verifyModalOpen && verifyingNominee && (
        <VerifyModal
          setIsOpen={handleVerifyCancel}
          secretkey={verifyingNominee.secretkey}
          onVerified={handleVerifySuccess}
        />
      )}
    </div>
  );
}
