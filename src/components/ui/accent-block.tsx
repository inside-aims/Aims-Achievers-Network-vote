import type React from "react"
import { cn } from "@/lib/utils"

interface AccentBlockProps {
  className?: string
  position: "top-right" | "bottom-left" | "center-right" | "custom"
  color?: string
  customStyle?: React.CSSProperties
}

export function AccentBlock({ className, position, color = "rgba(0, 255, 128, 0.15)", customStyle }: AccentBlockProps) {
  const positionStyles = {
    "top-right": "absolute top-0 right-0 w-1/4 h-1/4",
    "bottom-left": "absolute bottom-0 left-0 w-1/3 h-1/3",
    "center-right": "absolute top-1/3 right-0 w-1/5 h-1/3",
    custom: "absolute",
  }

  return (
    <div
      className={cn("backdrop-blur-sm z-0", positionStyles[position], className)}
      style={{
        backgroundColor: color,
        ...customStyle,
      }}
    />
  )
}
