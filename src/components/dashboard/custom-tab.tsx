"use client"

import { Users, TrendingUp } from "lucide-react"

interface CustomTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function CustomTabs({ activeTab, onTabChange }: CustomTabsProps) {
  return (
    <div className="flex bg-zinc-900 rounded-lg p-1 mb-6">
      <button
        onClick={() => onTabChange("table")}
        className={`flex-1 px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          activeTab === "table"
            ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg"
            : "text-yellow-400 hover:text-yellow-300 hover:bg-zinc-800"
        }`}
      >
        <Users className="w-4 h-4" />
        Table View
      </button>
      <button
        onClick={() => onTabChange("chart")}
        className={`flex-1 px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          activeTab === "chart"
            ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg"
            : "text-yellow-400 hover:text-yellow-300 hover:bg-zinc-800"
        }`}
      >
        <TrendingUp className="w-4 h-4" />
        Chart View
      </button>
    </div>
  )
}
