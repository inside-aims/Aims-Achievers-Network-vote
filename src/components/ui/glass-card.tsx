import { cn } from "@/lib/utils"
import type React from "react"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high"
  borderVisible?: boolean
  children: React.ReactNode
}

export function GlassCard({
  className,
  intensity = "medium",
  borderVisible = true,
  children,
  ...props
}: GlassCardProps) {
  const bgOpacity = {
    low: "bg-black/30",
    medium: "bg-black/50",
    high: "bg-black/70",
  }

  const borderStyle = borderVisible ? "border border-white/10" : ""

  return (
    <div
      className={cn(bgOpacity[intensity], borderStyle, "backdrop-blur-md rounded-lg shadow-xl", className)}
      {...props}
    >
      {children}
    </div>
  )
}
