"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/nomineebutton";

interface NominationModalProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function NominationModal({ setIsOpen }: NominationModalProps) {
  const [nominee, setNominee] = useState({
    fullName: "",
    stageName: "",
    institution: "",
    category: "Best Innovator", // Auto-filled
    profileImage: null as File | null,
    contactEmail: "",
    achievements: "",
  });

  const [nominator, setNominator] = useState({
    fullName: "",
    institution: "",
    email: "",
    phone: "",
  });

  const handleNomineeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNominee((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNominee((prev) => ({ ...prev, profileImage: file }));
  };

  const handleNominatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNominator((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nominee Data:", nominee);
    console.log("Nominator Data:", nominator);
    setIsOpen(false); // Close modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Nominate Someone</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nominee Details */}
          <div className="bg-gray-100 p-3 rounded-lg shadow">
            <h3 className="font-semibold mb-2 text-md">Nominee Details</h3>
            <input type="text" name="fullName" placeholder="Full Name" value={nominee.fullName} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm" required />
            <input type="text" name="stageName" placeholder="Stage Name (Optional)" value={nominee.stageName} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm mt-2" />
            <input type="text" name="institution" placeholder="Institution" value={nominee.institution} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm mt-2" required />
            <input type="email" name="contactEmail" placeholder="Nominee Contact Email (Optional)" value={nominee.contactEmail} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm mt-2" />
            <textarea name="achievements" placeholder="Nominee Achievements (100-300 words)" value={nominee.achievements} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm h-24 mt-2" required></textarea>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded text-sm bg-white mt-2" />
          </div>
          
          {/* Nominator Details */}
          <div className="bg-gray-100 p-3 rounded-lg shadow">
            <h3 className="font-semibold mb-2 text-md">Your Details</h3>
            <input type="text" name="fullName" placeholder="Your Full Name" value={nominator.fullName} onChange={handleNominatorChange} className="w-full p-2 border rounded text-sm" required />
            <input type="text" name="institution" placeholder="Your Institution" value={nominator.institution} onChange={handleNominatorChange} className="w-full p-2 border rounded text-sm mt-2" required />
            <input type="email" name="email" placeholder="Your Email" value={nominator.email} onChange={handleNominatorChange} className="w-full p-2 border rounded text-sm mt-2" required />
            <input type="text" name="phone" placeholder="Your Phone Number (Optional)" value={nominator.phone} onChange={handleNominatorChange} className="w-full p-2 border rounded text-sm mt-2" />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-between mt-4">
            <Button type="button" className="bg-gray-500 text-white px-3 py-2 rounded text-sm" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-award-gold text-black px-4 py-2 rounded text-sm">Submit Nomination</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
