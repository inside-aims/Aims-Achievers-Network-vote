"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Trophy } from "lucide-react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { CustomTabs } from "@/components/dashboard/custom-tab"
import { TableView } from "@/components/dashboard/table-view"
import { ChartView } from "@/components/dashboard/chart-view"
//import type { VoteData } from "@/lib/types"
import { fetchCategoriesWithNominees, fetchNomineesWithVotes } from "@/app/actions"
import { getSupabaseBrowserClient } from "@/config/client"

// Supabase implementation (commented out)
/*
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Real-time data fetching functions
async function fetchNomineesWithVotes(eventId: number) {
  const { data, error } = await supabase
    .from('nominee')
    .select(`
      id,
      name,
      stage_name,
      image,
      category:categoryid (
        id,
        name
      ),
      votes:vote (
        numberOfVotes
      )
    `)
    .eq('eventId', eventId)
    .eq('approved', true)

  if (error) throw error
  
  return data?.map(nominee => ({
    ...nominee,
    totalVotes: nominee.votes.reduce((sum, vote) => sum + (vote.numberOfVotes || 0), 0)
  })).sort((a, b) => b.totalVotes - a.totalVotes)
}

async function fetchCategoriesWithNominees(eventId: number) {
  const { data, error } = await supabase
    .from('category')
    .select(`
      id,
      name,
      nominees:nominee!categoryid (
        votes:vote (
          numberOfVotes
        )
      )
    `)
    .eq('eventID', eventId)

  if (error) throw error
  
  return data?.map(category => {
    const categoryNominees = category.nominees.map(nominee => ({
      ...nominee,
      totalVotes: nominee.votes.reduce((sum, vote) => sum + (vote.numberOfVotes || 0), 0)
    })).sort((a, b) => b.totalVotes - a.totalVotes)

    return {
      ...category,
      votes: categoryNominees.reduce((sum, nominee) => sum + nominee.totalVotes, 0),
      nominees: categoryNominees
    }
  })
}

// Real-time subscription
function subscribeToVoteChanges(onChange: () => void) {
  const channel = supabase
    .channel('vote-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'vote' },
      () => {
        // Refresh data when votes change
        onChange()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

async function fetchData() {
  try {
    setIsLoading(true)
    const eventId = 1 // Replace with actual event ID
    
    const [nominees, categoriesWithNominees] = await Promise.all([
      fetchNomineesWithVotes(eventId),
      fetchCategoriesWithNominees(eventId)
    ])

    const categories = categoriesWithNominees.map(({ nominees, ...cat }) => cat)

    setData({
      nominees,
      categories,
      categoriesWithNominees
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    setIsLoading(false)
  }
}
*/

function subscribeToVoteChanges(onChange: () => void) {
    const supabase = getSupabaseBrowserClient()
    const channel = supabase
      .channel('vote-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vote' },
        () => {
          // Refresh data when votes change
          onChange()
        }
      )
      .subscribe()
  
    return () => {
      supabase.removeChannel(channel)
    }
  }

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("table")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const [data, setData] = useState<any>()
const [isLoading, setIsLoading] = useState(false)
const [activeCategories , setActiveCategories] = useState<number>(0)

  const params = useParams();
  const evnId = params.evnid as string;


useEffect(() => {
    async function fetchData() {
        try {
          setIsLoading(true)
          const eventId = Number(evnId) // Replace with actual event ID
          
          const [nominees, categoriesWithNominees] = await Promise.all([
            fetchNomineesWithVotes(eventId),
            fetchCategoriesWithNominees(eventId)
          ])
      
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const categories = categoriesWithNominees.map(({ nominees, ...cat }) => cat)
      
        //   console.log("categories ", categories)
        //   const newCategories = categories.filter(cat => cat.votes > 0)
        //   console.log("newCategories ", newCategories)
          setActiveCategories(categories.length)
          setData({
            nominees,
            categories,
            categoriesWithNominees
          })
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    fetchData()
}, [])

  // Simulate real-time updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setData((prevData) => {
//         const updatedNominees = prevData.nominees
//           .map((nominee) => ({
//             ...nominee,
//             totalVotes: nominee.totalVotes + Math.floor(Math.random() * 3),
//           }))
//           .sort((a, b) => b.totalVotes - a.totalVotes)

//         // Recalculate category data
//         const updatedCategoriesWithNominees = prevData.categoriesWithNominees.map((category) => {
//           const categoryNominees = updatedNominees.filter((n) => n.category.id === category.id)
//           const totalVotes = categoryNominees.reduce((sum, nominee) => sum + nominee.totalVotes, 0)

//           return {
//             ...category,
//             votes: totalVotes,
//             nominees: categoryNominees,
//           }
//         })

//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         const updatedCategories = updatedCategoriesWithNominees.map(({ nominees, ...cat }) => cat)

//         return {
//           nominees: updatedNominees,
//           categories: updatedCategories,
//           categoriesWithNominees: updatedCategoriesWithNominees,
//         }
//       })
//     }, 5000)

//     return () => clearInterval(interval)
//   }, [])

  /* Real-time Supabase subscription (commented out) */
  useEffect(() => {
    async function fetchData() {
        try {
          setIsLoading(true)
          const eventId = 5 // Replace with actual event ID
          
          const [nominees, categoriesWithNominees] = await Promise.all([
            fetchNomineesWithVotes(eventId),
            fetchCategoriesWithNominees(eventId)
          ])
      
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const categories = categoriesWithNominees.map(({ nominees, ...cat }) => cat)
      
          setData({
            nominees,
            categories,
            categoriesWithNominees
          })
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setIsLoading(false)
        }
      }

    const unsubscribe = subscribeToVoteChanges(() => {

      // Refresh data when votes change
      fetchData()
    })

    return unsubscribe
  }, [])
 

if(!data || isLoading){
    return <div>Loading...</div>
}

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Voting Dashboard
            </h1>
          </div>
          <p className="text-zinc-400 text-lg">Monitoring of nominee votes</p>
        </div>

        {/* Stats Cards */}
        <StatsCards nominees={data.nominees} activeCategories={activeCategories} />

        {/* Custom Tabs */}
        <CustomTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        {activeTab === "table" ? (
          <TableView nominees={data.nominees} />
        ) : (
          <ChartView categories={data.categories} categoriesWithNominees={data.categoriesWithNominees} />
        )}
      </div>
    </div>
  )
}
