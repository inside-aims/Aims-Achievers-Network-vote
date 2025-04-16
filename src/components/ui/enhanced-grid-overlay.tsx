"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface EnhancedGridOverlayProps {
  className?: string
  lineColor?: string
  lineSpacing?: number
  visible?: boolean
  blurIntensity?: number
  accentColor?: string
}

export function EnhancedGridOverlay({
  className,
  lineColor = "rgba(255, 255, 255, 0.1)",
  lineSpacing = 80,
  visible = true,
  blurIntensity = 5,
  accentColor = "rgba(0, 255, 128, 0.05)",
}: EnhancedGridOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [gridCells, setGridCells] = useState<Array<{ x: number; y: number; width: number; height: number }>>([])

  useEffect(() => {
    if (!containerRef.current || !visible) return

    const updateGridCells = () => {
      const container = containerRef.current
      if (!container) return

      const { width, height } = container.getBoundingClientRect()
      const cols = Math.ceil(width / lineSpacing)
      const rows = Math.ceil(height / lineSpacing)

      const cells = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          cells.push({
            x: x * lineSpacing,
            y: y * lineSpacing,
            width: lineSpacing,
            height: lineSpacing,
          })
        }
      }
      setGridCells(cells)
    }

    updateGridCells()
    window.addEventListener("resize", updateGridCells)
    return () => window.removeEventListener("resize", updateGridCells)
  }, [lineSpacing, visible])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 pointer-events-none z-0 overflow-hidden", className)}
      style={{
        backgroundImage: `
          linear-gradient(to right, ${lineColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
        `,
        backgroundSize: `${lineSpacing}px ${lineSpacing}px`,
      }}
    >
      {/* Glass effect overlay cells */}
      {gridCells.map((cell, index) => {
        // Create varying blur and opacity effects
        const randomOpacity = Math.random() * 0.15 + 0.02
        const randomBlur = Math.random() * blurIntensity + 2
        const useAccentColor = Math.random() > 0.85 // 15% chance to use accent color

        return (
          <div
            key={index}
            className="absolute backdrop-blur-md"
            style={{
              left: cell.x,
              top: cell.y,
              width: cell.width,
              height: cell.height,
              opacity: randomOpacity,
              backdropFilter: `blur(${randomBlur}px)`,
              backgroundColor: useAccentColor ? accentColor : "rgba(255, 255, 255, 0.01)",
              transition: "opacity 0.5s ease, backdrop-filter 0.5s ease",
            }}
          />
        )
      })}
    </div>
  )
}
