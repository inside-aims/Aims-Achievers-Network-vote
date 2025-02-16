import "@/styles/globals.css"
import { Cinzel, Poppins } from "next/font/google"
import type { Metadata } from "next"
import type React from "react" // Import React

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
})

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Aims Achievers Network - Celebrating Excellence in Tertiary Education",
  description: "Recognizing and celebrating excellence across tertiary institutions.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${poppins.variable} font-sans`}>{children}</body>
    </html>
  )
}

