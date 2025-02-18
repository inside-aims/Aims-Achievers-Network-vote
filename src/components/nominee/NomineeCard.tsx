import { Card } from "../ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

interface NomineeProps {
  name: string;
  role: string;
  image: string;
  website: string;
}

export function NomineeCard({ name, role, image, website }: NomineeProps) {
  return (
    <Card className="relative aspect-[1.58/1] bg-black text-white overflow-hidden">
      <div className="absolute inset-0 p-6 flex flex-col">
        <div className="flex gap-6 h-full">
          {/* Left section with image */}
          <div className="w-[45%] bg-zinc-200">
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={image || "/placeholder.svg"}
                alt=""
                className="h-full w-full object-cover grayscale object-top"
              />
            </div>
          </div>

          {/* Right section with red accent */}
          <div className="relative flex-1">
            {/* Red geometric accent */}
            <div className="absolute right-0 top-0 w-24 h-24 bg-award-gold" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="space-y-1">
                <h3 className="text-2xl font-medium tracking-tight text-white">
                  {name}
                </h3>
                <p className="text-sm text-zinc-400">{role}</p>
              </div>

              {/* Bottom section with logo and website */}
              <div className="space-y-3">
                <div className="w-8 h-8">
                  <svg
                    viewBox="0 0 24 24"
                    className="text-award-gold"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 19.7778H22L12 2Z" />
                  </svg>
                </div>
                <div>
                  <motion.button
                    whileHover={{ color: "#FFD700" }}
                    className="text-[11px] font-cinzel border-award-gold border-[1px] p-1"
                  >
                    vote
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
