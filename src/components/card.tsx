import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg shadow-md ${className}`} {...props}>
      {children}
    </div>
  )
}

