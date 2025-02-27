import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/contestants-card"
import { Button } from "@/components/ui/nomineebutton"

interface Contestant {
  id: number
  name: string
  description: string
  image: string
}

const ContestantImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative w-full h-64">
    <Image src={src || "/placeholder.svg"} alt={alt} layout="fill" objectFit="cover" />
  </div>
)

const ContestantInfo = ({ name, description }: { name: string; description: string }) => (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-2">{name}</h2>
    <p className="text-muted-foreground">{description}</p>
  </div>
)

const VoteButton = ({ contestantId }: { contestantId: number }) => (
  <Link href={`/vote/${contestantId}`} className="w-full">
    <Button className="w-full">Vote Now</Button>
  </Link>
)

export const ContestantCard = ({ contestant }: { contestant: Contestant }) => {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
      <CardContent className="p-0">
        <ContestantImage src={contestant.image} alt={contestant.name} />
        <ContestantInfo name={contestant.name} description={contestant.description} />
      </CardContent>
      <CardFooter className="bg-primary/5 p-4">
        <VoteButton contestantId={contestant.id} />
      </CardFooter>
    </Card>
  )
}

