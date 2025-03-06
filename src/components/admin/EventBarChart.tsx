import type React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

// Sample data
const data = [
  { name: "Category A", votes: 400, nominations: 240 },
  { name: "Category B", votes: 300, nominations: 139 },
  { name: "Category C", votes: 200, nominations: 980 },
  { name: "Category D", votes: 278, nominations: 390 },
  { name: "Category E", votes: 189, nominations: 480 },
]

export const ExampleBarChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="votes" fill="#FFD700" />
        <Bar dataKey="nominations" fill="#C0C0C0" />
      </BarChart>
    </ResponsiveContainer>
  )
}
