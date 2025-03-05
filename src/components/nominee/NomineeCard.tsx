import { Card } from "../ui/card";
import { motion } from "framer-motion";

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
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>

          {/* Right section with red accent */}
          <div className="relative flex-1">
            {/* Red geometric accent */}
            <div className="absolute right-0 top-0 w-24 h-24 bg-gray-600" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="space-y-1">
                <h3 className="text-2xl font-medium tracking-tight">{name}</h3>
                <p className="text-sm text-award-gold">{role}</p>
              </div>

              {/* Bottom section with logo and website */}
              <div className="space-y-3">
                <div className="w-8 h-8">
                  <svg
                    viewBox="0 0 24 24"
                    className="text-gray-600"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 19.7778H22L12 2Z" />
                  </svg>
                </div>

                <motion.button
                  className=" absolute text-award-gold font-medium text-sm px-3 py-1 border border-award-gold rounded-md
                       hover:bg-award-gold hover:text-black transition-all right-0 bottom-5"
                >
                  Vote
                </motion.button>
                <p className="text-xs text-zinc-400">{website}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
