"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type TechStack, techStacks as initialTechStacks } from "@/lib/mock-data"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TechStacksManagement() {
  const [techStacks, setTechStacks] = useState<TechStack[]>(initialTechStacks)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTechStack, setCurrentTechStack] = useState<TechStack | null>(null)
  const [newTechStack, setNewTechStack] = useState<Omit<TechStack, "id">>({ name: "" })
  const { toast } = useToast()

  const handleAddTechStack = () => {
    if (!newTechStack.name.trim()) {
      toast({
        title: "Error",
        description: "Tech stack name cannot be empty",
        variant: "destructive",
      })
      return
    }

    const id = (techStacks.length + 1).toString()
    setTechStacks([...techStacks, { id, ...newTechStack }])
    setNewTechStack({ name: "" })
    setIsAddDialogOpen(false)
    toast({
      title: "Success",
      description: "Tech stack added successfully",
    })
  }

  const handleEditTechStack = () => {
    if (!currentTechStack) return
    if (!currentTechStack.name.trim()) {
      toast({
        title: "Error",
        description: "Tech stack name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setTechStacks(techStacks.map((tech) => (tech.id === currentTechStack.id ? currentTechStack : tech)))
    setIsEditDialogOpen(false)
    toast({
      title: "Success",
      description: "Tech stack updated successfully",
    })
  }

  const handleDeleteTechStack = () => {
    if (!currentTechStack) return
    setTechStacks(techStacks.filter((tech) => tech.id !== currentTechStack.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Tech stack deleted successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tech Stacks Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tech Stack
        </Button>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tech Stack</DialogTitle>
              <DialogDescription>Create a new tech stack for categorizing ideas.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newTechStack.name}
                  onChange={(e) => setNewTechStack({ ...newTechStack, name: e.target.value })}
                  placeholder="Enter tech stack name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTechStack}>Add Tech Stack</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {techStacks.map((tech) => (
              <TableRow key={tech.id}>
                <TableCell className="font-medium">{tech.id}</TableCell>
                <TableCell>{tech.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentTechStack(tech)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Dialog
                      open={isEditDialogOpen && currentTechStack?.id === tech.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setCurrentTechStack(null)
                      }}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Tech Stack</DialogTitle>
                          <DialogDescription>Update the tech stack details.</DialogDescription>
                        </DialogHeader>
                        {currentTechStack && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name">Name</Label>
                              <Input
                                id="edit-name"
                                value={currentTechStack.name}
                                onChange={(e) => setCurrentTechStack({ ...currentTechStack, name: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditTechStack}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => {
                        setCurrentTechStack(tech)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <Dialog
                      open={isDeleteDialogOpen && currentTechStack?.id === tech.id}
                      onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open)
                        if (!open) setCurrentTechStack(null)
                      }}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Tech Stack</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this tech stack? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        {currentTechStack && (
                          <div className="py-4">
                            <p>
                              You are about to delete the tech stack: <strong>{currentTechStack.name}</strong>
                            </p>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteTechStack}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
