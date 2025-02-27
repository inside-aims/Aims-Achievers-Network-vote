import { ContestantCard } from "@/components/ui/contestant-card"
// This would typically come from an API or database
const contestants = [
  {
    id: 1,
    name: "Ama Serwaa",
    description: "22-year-old student from Kumasi with a passion for environmental conservation.",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    name: "Efua Mensah",
    description: "25-year-old entrepreneur from Accra, advocating for women in tech.",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    name: "Akosua Boateng",
    description: "23-year-old aspiring doctor from Tamale, promoting health awareness.",
    image: "/placeholder.svg?height=400&width=300",
  },
  // Add more contestants as needed
]

export default function ContestantsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Ms Akwaaba Contestants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contestants.map((contestant) => (
          <ContestantCard key={contestant.id} contestant={contestant} />
        ))}
      </div>
    </div>
  )
}

