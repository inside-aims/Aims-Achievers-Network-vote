"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/nomineecard"
import { Button } from "../ui/nomineebutton"

// Mock data for nominees pending verification
const mockPendingNominees = [
  { id: 1, name: "John Doe", category: "Best Innovator" },
  { id: 2, name: "Jane Smith", category: "Community Impact" },
  { id: 3, name: "Bob Johnson", category: "Academic Excellence" },
]

export function NomineeVerification() {
  const [pendingNominees, setPendingNominees] = useState(mockPendingNominees)

  const handleVerify = (id: number) => {
    // In a real application, you would send a request to your backend here
    setPendingNominees(pendingNominees.filter((nominee) => nominee.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nominee Verification</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingNominees.length === 0 ? (
          <p>No nominees pending verification.</p>
        ) : (
          <ul className="space-y-2">
            {pendingNominees.map((nominee) => (
              <li key={nominee.id} className="flex justify-between items-center">
                <span>
                  {nominee.name} - {nominee.category}
                </span>
                <Button onClick={() => handleVerify(nominee.id)}>Verify</Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

