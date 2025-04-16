import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface FuturisticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  glowing?: boolean
}

export const FuturisticButton = forwardRef<HTMLButtonElement, FuturisticButtonProps>(
  ({ className, variant = "primary", size = "md", glowing = false, children, ...props }, ref) => {
    const variantStyles = {
      primary: "bg-accent-green/80 hover:bg-accent-green text-black font-medium",
      secondary: "bg-white/10 hover:bg-white/20 text-white",
      outline: "bg-transparent border border-accent-green/50 text-accent-green hover:border-accent-green",
    }

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3",
    }

    const glowEffect = glowing
      ? "after:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-accent-green/30 after:blur-xl after:opacity-70"
      : ""

    return (
      <button
        ref={ref}
        className={cn(
          "relative backdrop-blur-sm rounded-md transition-all duration-200 ease-out",
          "font-display uppercase tracking-wider",
          variantStyles[variant],
          sizeStyles[size],
          glowEffect,
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

FuturisticButton.displayName = "FuturisticButton"
