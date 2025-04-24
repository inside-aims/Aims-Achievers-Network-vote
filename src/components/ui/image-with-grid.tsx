"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageWithGridProps {
  src: string
  alt: string
  className?: string
  overlayColor?: string
  gridCellSize?: number
  accentColor?: string
}

export function ImageWithGrid({
  src,
  alt,
  className,
  overlayColor = "rgba(0, 0, 0, 0.2)",
  gridCellSize = 3,
  accentColor = "rgba(0, 255, 128, 0.1)",
}: ImageWithGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [gridCells, setGridCells] = useState<Array<{ x: number; y: number; width: number; height: number }>>([])

  useEffect(() => {
    if (!containerRef.current) return

    const updateGridCells = () => {
      const container = containerRef.current
      if (!container) return

      const { width, height } = container.getBoundingClientRect()
      const cellWidth = width / gridCellSize
      const cellHeight = height / gridCellSize

      const cells = []
      for (let y = 0; y < gridCellSize; y++) {
        for (let x = 0; x < gridCellSize; x++) {
          cells.push({
            x: x * cellWidth,
            y: y * cellHeight,
            width: cellWidth,
            height: cellHeight,
          })
        }
      }
      setGridCells(cells)
    }

    updateGridCells()
    window.addEventListener("resize", updateGridCells)
    return () => window.removeEventListener("resize", updateGridCells)
  }, [gridCellSize])

  return (
    <div ref={containerRef} className={cn("relative w-full h-full overflow-hidden", className)}>
      <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" sizes="100vw" priority />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${gridCellSize}, 1fr)` }}>
        {gridCells.map((cell, index) => {
          // Create varying blur and opacity effects
          const randomOpacity = Math.random() * 0.3 + 0.05
          const randomBlur = Math.random() * 5 + 1
          const useAccentColor = Math.random() > 0.7 // 30% chance to use accent color

          return (
            <div
              key={index}
              className="border border-white/10 relative overflow-hidden"
              style={{
                gridColumn: `span 1`,
                gridRow: `span 1`,
              }}
            >
              <div
                className="absolute inset-0 backdrop-blur-md"
                style={{
                  opacity: randomOpacity,
                  backdropFilter: `blur(${randomBlur}px)`,
                  backgroundColor: useAccentColor ? accentColor : overlayColor,
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
