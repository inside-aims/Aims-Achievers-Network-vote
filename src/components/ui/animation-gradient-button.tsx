"use client"

import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef, useState } from "react"

interface AnimatedGradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  glowing?: boolean
  gradientFrom?: string
  gradientTo?: string
  hoverScale?: boolean
}

export const AnimatedGradientButton = forwardRef<HTMLButtonElement, AnimatedGradientButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      glowing = false,
      gradientFrom = "from-accent-green/80",
      gradientTo = "to-accent-green",
      hoverScale = true,
      children,
      ...props
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false)

    const variantStyles = {
      primary: `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-black font-medium`,
      secondary: `bg-white/10 hover:bg-white/20 text-white`,
      outline: `bg-transparent border border-accent-green/50 text-accent-green hover:border-accent-green`,
    }

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3",
    }

    const glowEffect = glowing
      ? "after:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-accent-green/30 after:blur-xl after:opacity-70"
      : ""

    const hoverScaleEffect = hoverScale ? "hover:scale-105 active:scale-95" : ""

    return (
      <button
        ref={ref}
        className={cn(
          "relative backdrop-blur-sm rounded-md transition-all duration-300 ease-out",
          "font-display uppercase tracking-wider",
          variantStyles[variant],
          sizeStyles[size],
          glowEffect,
          hoverScaleEffect,
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <span
          className={cn(
            "relative z-10 flex items-center justify-center",
            isHovered && variant === "primary" ? "animate-pulse-slow" : "",
          )}
        >
          {children}
        </span>
      </button>
    )
  },
)

AnimatedGradientButton.displayName = "AnimatedGradientButton"
