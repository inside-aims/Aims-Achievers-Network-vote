import { cn } from "@/lib/utils"

interface GridOverlayProps {
  className?: string
  lineColor?: string
  lineSpacing?: number
  visible?: boolean
}

export function GridOverlay({
  className,
  lineColor = "rgba(255, 255, 255, 0.1)",
  lineSpacing = 80,
  visible = true,
}: GridOverlayProps) {
  if (!visible) return null

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none z-0", className)}
      style={{
        backgroundImage: `
          linear-gradient(to right, ${lineColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
        `,
        backgroundSize: `${lineSpacing}px ${lineSpacing}px`,
      }}
    />
  )
}
