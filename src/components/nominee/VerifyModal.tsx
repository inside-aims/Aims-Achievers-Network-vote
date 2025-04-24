"use client"

import { motion } from "framer-motion";
import { Button } from "@/components/ui/nomineebutton";
import { VerifyModalProps } from "@/lib/types";
import { useState } from "react";

export default function VerifyModal({ setIsOpen, secretkey, onVerified }: VerifyModalProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === secretkey) {
      setError("");
      onVerified();
    } else {
      setError("Incorrect secret key.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-300 p-6 rounded-lg shadow-xl w-full max-w-sm h-[260px]">
        <h2 className="text-xl font-bold mb-4 text-center">Verify Nominee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-100 p-3 rounded-lg shadow">
            <h3 className="font-semibold mb-2 text-md">Enter Secret Key</h3>
            <input
              type="password"
              name="secretkey"
              placeholder="Secret Key"
              className="w-full p-2 border rounded text-sm text-black"
              value={input}
              onChange={e => setInput(e.target.value)}
              required
            />
            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
          </div>
          <div className="flex justify-between mt-4">
            <Button type="button" className="bg-gray-500 text-white px-3 py-2 rounded text-sm" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-award-gold text-black px-4 py-2 rounded text-sm">Verify</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
