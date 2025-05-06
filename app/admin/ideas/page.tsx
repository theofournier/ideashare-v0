"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal, Pencil, Trash, Search, Flag, Plus } from "lucide-react"
import { extendedIdeas, type ExtendedIdea, type IdeaStatus } from "@/lib/admin-data"
import { getUserById } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function IdeasManagement() {
  const [ideas, setIdeas] = useState<ExtendedIdea[]>(extendedIdeas)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "votes" | "title" | "reports">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedIdea, setSelectedIdea] = useState<ExtendedIdea | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<IdeaStatus>("published")

  const router = useRouter()
  const { toast } = useToast()

  // Filter and sort ideas
  const filteredIdeas = ideas
    .filter((idea) => {
      // Filter by search term
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by status
      const matchesStatus = statusFilter === "all" || idea.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }

      if (sortBy === "votes") {
        return sortOrder === "asc" ? a.upvotes - b.upvotes : b.upvotes - a.upvotes
      }

      if (sortBy === "reports") {
        const aReports = a.reportCount || 0
        const bReports = b.reportCount || 0
        return sortOrder === "asc" ? aReports - bReports : bReports - aReports
      }

      // Sort by title
      return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    })

  const handleDelete = () => {
    if (!selectedIdea) return

    setIdeas(ideas.filter((idea) => idea.id !== selectedIdea.id))
    setIsDeleteDialogOpen(false)

    toast({
      title: "Idea deleted",
      description: `"${selectedIdea.title}" has been deleted.`,
    })
  }

  const handleStatusChange = () => {
    if (!selectedIdea) return

    setIdeas(ideas.map((idea) => (idea.id === selectedIdea.id ? { ...idea, status: newStatus } : idea)))
    setIsStatusDialogOpen(false)

    toast({
      title: "Status updated",
      description: `"${selectedIdea.title}" is now ${newStatus}.`,
    })
  }

  const getStatusBadge = (status: IdeaStatus) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>
      case "hidden":
        return <Badge variant="outline">Hidden</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ideas Management</h1>
        <Button asChild>
          <Link href="/submit">
            <Plus className="mr-2 h-4 w-4" />
            Add New Idea
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as IdeaStatus | "all")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "votes" | "title" | "reports")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="votes">Votes</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Reports</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIdeas.map((idea) => {
              const author = getUserById(idea.userId)

              return (
                <TableRow key={idea.id}>
                  <TableCell className="font-mono text-xs">{idea.id}</TableCell>
                  <TableCell className="font-medium">{idea.title}</TableCell>
                  <TableCell>{author?.name || "Unknown"}</TableCell>
                  <TableCell>{new Date(idea.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{idea.upvotes}</TableCell>
                  <TableCell>
                    {idea.reportCount ? (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Flag className="h-3 w-3" />
                        {idea.reportCount}
                      </Badge>
                    ) : (
                      "0"
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(idea.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/idea/${idea.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/idea/${idea.id}/edit`)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedIdea(idea)
                            setNewStatus(idea.status)
                            setIsStatusDialogOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Change Status
                        </DropdownMenuItem>
                        {idea.reportCount ? (
                          <DropdownMenuItem onClick={() => router.push(`/admin/reports?ideaId=${idea.id}`)}>
                            <Flag className="mr-2 h-4 w-4" />
                            View Reports ({idea.reportCount})
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedIdea(idea)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}

            {filteredIdeas.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No ideas found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Idea</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedIdea?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Idea Status</DialogTitle>
            <DialogDescription>Update the status for &quot;{selectedIdea?.title}&quot;</DialogDescription>
          </DialogHeader>

          <Select value={newStatus} onValueChange={(value) => setNewStatus(value as IdeaStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
