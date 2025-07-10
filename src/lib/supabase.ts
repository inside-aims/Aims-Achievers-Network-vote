// Supabase implementation (commented out)
/*
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function fetchNomineesWithVotes(eventId: number) {
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
  })).sort((a, b) => b.totalVotes - a.totalVotes) || []
}

export async function fetchCategoriesWithNominees(eventId: number) {
  const { data, error } = await supabase
    .from('category')
    .select(`
      id,
      name,
      nominees:nominee!categoryid (
        id,
        name,
        stage_name,
        image,
        votes:vote (
          numberOfVotes
        )
      )
    `)
    .eq('eventID', eventId)

  if (error) throw error
  
  return data?.map(category => ({
    id: category.id,
    name: category.name,
    votes: category.nominees.reduce((sum, nominee) => 
      sum + nominee.votes.reduce((voteSum, vote) => voteSum + (vote.numberOfVotes || 0), 0), 0
    ),
    nominees: category.nominees.map(nominee => ({
      id: nominee.id,
      name: nominee.name,
      stage_name: nominee.stage_name,
      image: nominee.image,
      category: { id: category.id, name: category.name },
      totalVotes: nominee.votes.reduce((sum, vote) => sum + (vote.numberOfVotes || 0), 0)
    })).sort((a, b) => b.totalVotes - a.totalVotes)
  })) || []
}

export function subscribeToVoteChanges(callback: () => void) {
  const channel = supabase
    .channel('vote-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'vote' },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
*/

// Dummy data for demonstration
export const dummyNominees = [
    // Best Singer Category
    {
      id: "1",
      name: "Sarah Johnson",
      stage_name: "The Golden Voice",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Singer", id: "cat1" },
      totalVotes: 1247,
    },
    {
      id: "5",
      name: "Lisa Park",
      stage_name: "Melody Maker",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Singer", id: "cat1" },
      totalVotes: 743,
    },
    {
      id: "9",
      name: "Alex Rivera",
      stage_name: "Vocal Virtuoso",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Singer", id: "cat1" },
      totalVotes: 612,
    },
    {
      id: "13",
      name: "Maya Chen",
      stage_name: "Harmony Queen",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Singer", id: "cat1" },
      totalVotes: 534,
    },
    {
      id: "17",
      name: "Jordan Smith",
      stage_name: "Soul Singer",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Singer", id: "cat1" },
      totalVotes: 445,
    },
  
    // Best Dancer Category
    {
      id: "2",
      name: "Michael Chen",
      stage_name: "Dance Master",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Dancer", id: "cat2" },
      totalVotes: 1156,
    },
    {
      id: "6",
      name: "James Wilson",
      stage_name: "Rhythm King",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Dancer", id: "cat2" },
      totalVotes: 654,
    },
    {
      id: "10",
      name: "Sofia Martinez",
      stage_name: "Dance Diva",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Dancer", id: "cat2" },
      totalVotes: 587,
    },
    {
      id: "14",
      name: "Ryan Taylor",
      stage_name: "Hip Hop Hero",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Dancer", id: "cat2" },
      totalVotes: 498,
    },
    {
      id: "18",
      name: "Zoe Anderson",
      stage_name: "Ballet Beauty",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Dancer", id: "cat2" },
      totalVotes: 423,
    },
  
    // Best Comedian Category
    {
      id: "3",
      name: "Emma Rodriguez",
      stage_name: "Comedy Queen",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Comedian", id: "cat3" },
      totalVotes: 987,
    },
    {
      id: "7",
      name: "Chris Brown",
      stage_name: "Laugh Master",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Comedian", id: "cat3" },
      totalVotes: 756,
    },
    {
      id: "11",
      name: "Nina Patel",
      stage_name: "Joke Genius",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Comedian", id: "cat3" },
      totalVotes: 634,
    },
    {
      id: "15",
      name: "Marcus Johnson",
      stage_name: "Comedy King",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Comedian", id: "cat3" },
      totalVotes: 567,
    },
  
    // Best Speaker Category
    {
      id: "4",
      name: "David Thompson",
      stage_name: "The Storyteller",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Speaker", id: "cat4" },
      totalVotes: 876,
    },
    {
      id: "8",
      name: "Rachel Green",
      stage_name: "Voice of Wisdom",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Speaker", id: "cat4" },
      totalVotes: 698,
    },
    {
      id: "12",
      name: "Kevin Lee",
      stage_name: "Motivational Mike",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Speaker", id: "cat4" },
      totalVotes: 543,
    },
    {
      id: "16",
      name: "Amanda White",
      stage_name: "Inspiring Amy",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Speaker", id: "cat4" },
      totalVotes: 467,
    },
  
    // Additional nominees for pagination testing
    {
      id: "19",
      name: "Tyler Brooks",
      stage_name: "The Entertainer",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Singer", id: "cat1" },
      totalVotes: 389,
    },
    {
      id: "20",
      name: "Olivia Davis",
      stage_name: "Dance Star",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Dancer", id: "cat2" },
      totalVotes: 356,
    },
    {
      id: "21",
      name: "Sam Wilson",
      stage_name: "Funny Guy",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Comedian", id: "cat3" },
      totalVotes: 334,
    },
    {
      id: "22",
      name: "Grace Miller",
      stage_name: "Public Speaker",
      image: "/placeholder.svg?height=40&width=40",
      category: { name: "Best Speaker", id: "cat4" },
      totalVotes: 312,
    },
  ]
  
  export function getDummyData() {
    const categories = [
      { id: "cat1", name: "Best Singer", votes: 0 },
      { id: "cat2", name: "Best Dancer", votes: 0 },
      { id: "cat3", name: "Best Comedian", votes: 0 },
      { id: "cat4", name: "Best Speaker", votes: 0 },
    ]
  
    const categoriesWithNominees = categories.map((category) => {
      const categoryNominees = dummyNominees.filter((n) => n.category.id === category.id)
      const totalVotes = categoryNominees.reduce((sum, nominee) => sum + nominee.totalVotes, 0)
  
      return {
        ...category,
        votes: totalVotes,
        nominees: categoryNominees,
      }
    })
  
    return {
      nominees: dummyNominees.sort((a, b) => b.totalVotes - a.totalVotes),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      categories: categoriesWithNominees.map(({ nominees, ...cat }) => cat),
      categoriesWithNominees,
    }
  }
  