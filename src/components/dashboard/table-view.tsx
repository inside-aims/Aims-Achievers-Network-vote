"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react"
import type { Nomineee } from "@/lib/types"

interface TableViewProps {
  nominees: Nomineee[]
}

export function TableView({ nominees }: TableViewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const totalPages = Math.ceil(nominees.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNominees = nominees.slice(startIndex, endIndex)

  const totalVotes = nominees.reduce((sum, nominee) => sum + nominee.totalVotes, 0)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-yellow-400">Nominees Leaderboard</CardTitle>
            <p className="text-zinc-400">Sorted by total votes (highest to lowest)</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            Showing {startIndex + 1}-{Math.min(endIndex, nominees.length)} of {nominees.length} nominees
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                <TableHead className="text-yellow-400">Rank</TableHead>
                <TableHead className="text-yellow-400">Nominee</TableHead>
                <TableHead className="text-yellow-400">Category</TableHead>
                <TableHead className="text-yellow-400 text-right">Votes</TableHead>
                <TableHead className="text-yellow-400 text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentNominees.map((nominee, index) => {
                const globalRank = startIndex + index + 1
                return (
                  <TableRow key={nominee.id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-yellow-400">#{globalRank}</span>
                        {globalRank === 1 && <Trophy className="w-4 h-4 text-yellow-400" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={nominee.image || "/placeholder.svg"}
                          alt={nominee.name}
                          className="w-10 h-10 rounded-full border-2 border-yellow-400/20"
                        />
                        <div>
                          <div className="font-medium text-white">{nominee.name}</div>
                          <div className="text-sm text-zinc-400">{nominee.stage_name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">
                        {nominee.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-lg font-bold text-yellow-400">{nominee.totalVotes.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-zinc-300">{((nominee.totalVotes / totalVotes) * 100).toFixed(1)}%</span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
            <div className="text-sm text-zinc-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className={
                        currentPage === pageNum
                          ? "bg-yellow-400 text-black hover:bg-yellow-500"
                          : "border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400"
                      }
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
