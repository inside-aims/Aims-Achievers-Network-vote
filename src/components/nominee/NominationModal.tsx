/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/nomineebutton";
import { NominationModalProps } from "@/lib/types";
import { getSupabaseBrowserClient } from "@/config/client";
import toast from "react-hot-toast";


export default function NominationModal({ setIsOpen, categoryId }: NominationModalProps) {
  const supabase = getSupabaseBrowserClient();
  const [nominee, setNominee] = useState({
    fullName: "",
    stageName: "",
    class: "",
    department:"",
    phone:"",
    category: categoryId, // Auto-filled
    profileImage: null as File | null,
    contactEmail: "",
    achievements: "",
  });

  const [nominator, setNominator] = useState({
    fullName: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nominee Data:", nominee);
    console.log("Nominator Data:", nominator);

    // Handle form submission logic here
    const event_id_to_insert = null; // Replace with actual event_id if available

    try {
      const { data, error } = await supabase
        .from('nominations')
        .insert([
          {
            nominee_name: nominee.fullName,
            class: nominee.class,
            phone: nominee.phone,
            department: nominee.department,
            nominator_name: nominator.fullName || null, // Set to null if empty
            nominator_phone: nominator.phone || null,   // Set to null if empty
            email: nominee.contactEmail || null,        // Set to null if empty
            nominee_achievement: nominee.achievements || null, // Set to null if empty
            category_id: nominee.category, // This is the categoryId prop
            event_id: event_id_to_insert, 
            stage_name: nominee.stageName || null,      // Set to null if empty
            // profile_image_url: uploadedImageUrl, // Store the URL after uploading the image
          },
        ])
        .select();
  
      if (error) {
        console.error('Error inserting nomination:', error);
        toast.error('Error inserting nomination. Try again!');
        // You might want to show an error message to the user here
      }
  
      console.log('Nomination submitted successfully:', data);
      toast.success('Nomination submitted successfully!');
      // You might want to show a success message to the user here
      setIsOpen(false); // Close modal after successful submission
    } catch (error: any) {
      console.error('Failed to submit nomination:', error);
      toast.error('Failed to submit nomination. Try again!');
      // You might want to show an error message to the user here
      return { success: false, error: error.message || 'Failed to submit nomination. Try again!' };
    }
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Nominate Someone</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          {/* Nominee Details */}
          <div className="bg-gray-100 p-3 rounded-lg shadow">
            <h3 className="font-semibold mb-2 text-md">Nominee Details</h3>
            <input type="text" name="fullName" placeholder="Full Name" value={nominee.fullName} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm" required />
            <input type="text" name="stageName" placeholder="Stage Name (Optional)" value={nominee.stageName} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm mt-2" />
            <input type="text" name="class" placeholder="Class" value={nominee.class} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm mt-2" required />
            <input type="text" name="department" placeholder="Department" value={nominee.department} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm mt-2" required />
            <input type="text" name="phone" placeholder="Phone Number" value={nominee.phone} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm mt-2" required />
            <input type="email" name="contactEmail" placeholder="Nominee Contact Email (Optional)" value={nominee.contactEmail} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm mt-2" />
            <textarea name="achievements" placeholder="Nominee Achievements (100-300 words) (Optional)" value={nominee.achievements} onChange={handleNomineeChange} className="w-full p-2 border rounded text-sm h-24 mt-2" required></textarea>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded text-sm bg-white mt-2" />
          </div>
          
          {/* Nominator Details */}
          <div className="bg-gray-100 p-3 rounded-lg shadow">
            <h3 className="font-semibold mb-2 text-md">Your Details(Not the Nominee)</h3>
            <input type="text" name="fullName" placeholder="Your Full Name" value={nominator.fullName} onChange={handleNominatorChange} className="w-full p-2 border rounded text-sm" required />
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
