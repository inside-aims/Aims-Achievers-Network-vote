// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/nomineecard";
// import { Button } from "../ui/nomineebutton";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// // Mock data for nominees and categories
// const mockNominees = [
//   { id: 1, name: "John Doe", category: "Best Innovator" },
//   { id: 2, name: "Jane Smith", category: "Community Impact" },
// ];

// const mockCategories = [
//   "Best Innovator",
//   "Community Impact",
//   "Academic Excellence",
// ];

// export function NomineeManagement() {
//   const [nominees, setNominees] = useState(mockNominees);
//   const [newNomineeName, setNewNomineeName] = useState("");
//   const [newNomineeCategory, setNewNomineeCategory] = useState("");

//   const handleAddNominee = () => {
//     if (newNomineeName.trim() && newNomineeCategory) {
//       setNominees([
//         ...nominees,
//         {
//           id: Date.now(),
//           name: newNomineeName.trim(),
//           category: newNomineeCategory,
//         },
//       ]);
//       setNewNomineeName("");
//       setNewNomineeCategory("");
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Nominee Management</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex space-x-2 mb-4">
//           <Input
//             value={newNomineeName}
//             onChange={(e) => setNewNomineeName(e.target.value)}
//             placeholder="New nominee name"
//           />
//           <Select
//             value={newNomineeCategory}
//             onValueChange={setNewNomineeCategory}
//           >
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select category" />
//             </SelectTrigger>
//             <SelectContent>
//               {mockCategories.map((category) => (
//                 <SelectItem key={category} value={category}>
//                   {category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Button onClick={handleAddNominee}>Add</Button>
//         </div>
//         <ul className="space-y-2">
//           {nominees.map((nominee) => (
//             <li key={nominee.id} className="flex justify-between items-center">
//               <span>
//                 {nominee.name} - {nominee.category}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//     </Card>
//   );
// }
import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/admincard"
import { Button } from "@/components/ui/adminbutton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NomineeCard } from "@/components/nominee/NomineeCard"

interface Nominee {
  id: string
  name: string
  role: string
  image: string
  website: string
  category: string
}

// Mock data for nominees and categories
const mockNominees: Nominee[] = [
  {
    id: "1",
    name: "Ada Balogun",
    role: "Lead Marketer",
    image: "/assets/images/nominee/nom-1.webp",
    website: "www.torlago.com",
    category: "Best Innovator",
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Senior Developer",
    image: "/assets/images/nominee/nom-2.webp",
    website: "www.torlago.com",
    category: "Community Impact",
  },
]

const mockCategories = ["Best Innovator", "Community Impact", "Academic Excellence"]

export function NomineeManagement() {
  const [nominees, setNominees] = useState<Nominee[]>(mockNominees)
  const [newNominee, setNewNominee] = useState<Nominee>({
    id: "",
    name: "",
    role: "",
    image: "",
    website: "",
    category: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewNominee((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setNewNominee((prev) => ({ ...prev, category: value }))
  }

  const handleAddNominee = () => {
    if (newNominee.name.trim() && newNominee.category) {
      const nomineeToAdd = {
        ...newNominee,
        id: Date.now().toString(),
        image: newNominee.image || "/placeholder.svg",
      }
      setNominees([...nominees, nomineeToAdd])
      setNewNominee({ id: "", name: "", role: "", image: "", website: "", category: "" })
    }
  }

  const handleDeleteNominee = (id: string) => {
    setNominees(nominees.filter((nominee) => nominee.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nominee Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <Input name="name" value={newNominee.name} onChange={handleInputChange} placeholder="Nominee name" />
          <Input name="role" value={newNominee.role} onChange={handleInputChange} placeholder="Nominee role" />
          <Input
            name="image"
            value={newNominee.image}
            onChange={handleInputChange}
            placeholder="Image URL (optional)"
          />
          <Input name="website" value={newNominee.website} onChange={handleInputChange} placeholder="Website" />
          <Select value={newNominee.category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {mockCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddNominee} className="w-full">
            Add Nominee
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nominees.map((nominee) => (
            <div key={nominee.id} className="relative">
              <NomineeCard {...nominee} />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleDeleteNominee(nominee.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

