"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/admincard"
import { Button } from "@/components/ui/adminbutton"
// import { Input } from "@/components/ui/input"


// Mock data for categories
const mockCategories = [
  { id: 1, name: "Best Innovator", thumbnail: "/placeholder.svg" },
  { id: 2, name: "Community Impact", thumbnail: "/placeholder.svg" },
  { id: 3, name: "Academic Excellence", thumbnail: "/placeholder.svg" },
]

export function CategoryManagement() {
  const [categories, setCategories] = useState(mockCategories)
  const [newCategory, setNewCategory] = useState("")
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddCategory = () => {
    if (newCategory.trim() && newThumbnail) {
      const thumbnailUrl = URL.createObjectURL(newThumbnail)
      setCategories([...categories, { id: Date.now(), name: newCategory.trim(), thumbnail: thumbnailUrl }])
      setNewCategory("")
      setNewThumbnail(null)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setNewThumbnail(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div>
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="bg-award-blue/10 border-award-gold/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="categoryThumbnail">Category Thumbnail</Label>
            <Input
              id="categoryThumbnail"
              type="file"
              onChange={handleThumbnailChange}
              ref={fileInputRef}
              accept="image/*"
              className="bg-award-blue/10 border-award-gold/20 text-white"
            />
          </div>
          {previewUrl && (
            <div className="mt-2">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Thumbnail preview"
                width={100}
                height={100}
                className="object-cover rounded"
              />
            </div>
          )}
          <Button
            onClick={handleAddCategory}
            disabled={!newCategory.trim() || !newThumbnail}
            className="bg-award-gold hover:bg-award-gold/80 text-black font-bold"
          >
            Add Category
          </Button>
        </div>
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between bg-award-blue/10 p-4 rounded">
              <div className="flex items-center space-x-4">
                <Image
                  src={category.thumbnail || "/placeholder.svg"}
                  alt={`${category.name} thumbnail`}
                  width={50}
                  height={50}
                  className="object-cover rounded"
                />
                <span className="text-award-silver">{category.name}</span>
              </div>
              <Button
                variant="destructive"
                onClick={() => handleDeleteCategory(category.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// import type React from "react"
// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/admincard"
// import { Button } from "@/components/ui/adminbutton"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import CategoryCard from "@/components/categories/CategoryCards"

// interface Category {
//   id: string
//   name: string
//   image: string
//   description: string
// }

// // Mock data for categories
// const mockCategories: Category[] = [
//   {
//     id: "1",
//     name: "Academic Excellence",
//     image: "/images/academic-excellence.jpg",
//     description: "Recognizing outstanding academic achievements and scholarly contributions.",
//   },
//   {
//     id: "2",
//     name: "Innovation",
//     image: "/images/innovation.jpg",
//     description: "Honoring groundbreaking research and innovative solutions in academia.",
//   },
// ]

// export function CategoryManagement() {
//   const [categories, setCategories] = useState<Category[]>(mockCategories)
//   const [newCategory, setNewCategory] = useState<Category>({
//     id: "",
//     name: "",
//     image: "",
//     description: "",
//   })

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setNewCategory((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleAddCategory = () => {
//     if (newCategory.name.trim() && newCategory.description.trim()) {
//       const categoryToAdd = {
//         ...newCategory,
//         id: Date.now().toString(),
//         image: newCategory.image || "/placeholder.svg",
//       }
//       setCategories([...categories, categoryToAdd])
//       setNewCategory({ id: "", name: "", image: "", description: "" })
//     }
//   }

//   const handleDeleteCategory = (id: string) => {
//     setCategories(categories.filter((category) => category.id !== id))
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Category Management</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4 mb-6">
//           <Input name="name" value={newCategory.name} onChange={handleInputChange} placeholder="Category name" />
//           <Input
//             name="image"
//             value={newCategory.image}
//             onChange={handleInputChange}
//             placeholder="Image URL (optional)"
//           />
//           <Textarea
//             name="description"
//             value={newCategory.description}
//             onChange={handleInputChange}
//             placeholder="Category description"
//           />
//           <Button onClick={handleAddCategory} className="w-full">
//             Add Category
//           </Button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {categories.map((category) => (
//             <div key={category.id} className="relative">
//               <CategoryCard category={category} />
//               <Button
//                 variant="destructive"
//                 size="sm"
//                 className="absolute top-2 right-2"
//                 onClick={() => handleDeleteCategory(category.id)}
//               >
//                 Delete
//               </Button>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


