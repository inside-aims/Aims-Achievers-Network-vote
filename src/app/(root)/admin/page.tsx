"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/admintabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/admincard"
import { NomineeVerification } from "@/components/admin/NomineeVerification"
import { CategoryManagement } from "@/components/admin/CategoryManagement"
import { NomineeManagement } from "@/components/admin/NomineeManagement"
import { AnalyticsChart } from "@/components/admin/AnalyticChart"
import { Button } from "@/components/ui/adminbutton"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // In a real application, you would check for authentication here
  // For this example, we'll use a simple state to simulate authentication
  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    router.push("/")
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0D0D1F] via-[#1A1A3A] to-[#2D2D5A]">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Please log in to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D1F] via-[#1A1A3A] to-[#2D2D5A] text-white p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-award-gold font-cinzel">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        <Tabs defaultValue="nominees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="nominees">Nominees</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="nominees" className="space-y-4">
            <NomineeVerification />
            <NomineeManagement />
          </TabsContent>
          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsChart />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}



