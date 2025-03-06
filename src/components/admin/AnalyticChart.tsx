import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/admincard"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Mock data for analytics
const mockData = [
  { category: "Best Innovator", votes: 65, nominations: 80 },
  { category: "Community Impact", votes: 45, nominations: 60 },
  { category: "Academic Excellence", votes: 55, nominations: 70 },
]

export function AnalyticsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={mockData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Bar dataKey="votes" fill="#FFD700" name="Votes" />
            <Bar dataKey="nominations" fill="#C0C0C0" name="Nominations" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

