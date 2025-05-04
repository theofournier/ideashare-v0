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
import { type Tag, tags as initialTags } from "@/lib/mock-data"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TagsManagement() {
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTag, setCurrentTag] = useState<Tag | null>(null)
  const [newTag, setNewTag] = useState<Omit<Tag, "id">>({ name: "", color: "bg-gray-500" })
  const { toast } = useToast()

  const colorOptions = [
    { value: "bg-red-500", label: "Red" },
    { value: "bg-orange-500", label: "Orange" },
    { value: "bg-yellow-500", label: "Yellow" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-indigo-500", label: "Indigo" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-gray-500", label: "Gray" },
  ]

  const handleAddTag = () => {
    if (!newTag.name.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive",
      })
      return
    }

    const id = (tags.length + 1).toString()
    setTags([...tags, { id, ...newTag }])
    setNewTag({ name: "", color: "bg-gray-500" })
    setIsAddDialogOpen(false)
    toast({
      title: "Success",
      description: "Tag added successfully",
    })
  }

  const handleEditTag = () => {
    if (!currentTag) return
    if (!currentTag.name.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setTags(tags.map((tag) => (tag.id === currentTag.id ? currentTag : tag)))
    setIsEditDialogOpen(false)
    toast({
      title: "Success",
      description: "Tag updated successfully",
    })
  }

  const handleDeleteTag = () => {
    if (!currentTag) return
    setTags(tags.filter((tag) => tag.id !== currentTag.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "Success",
      description: "Tag deleted successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tags Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
              <DialogDescription>Create a new tag for categorizing ideas.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="Enter tag name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value}
                      className={`flex h-10 cursor-pointer items-center justify-center rounded-md border ${
                        newTag.color === color.value ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setNewTag({ ...newTag, color: color.value })}
                    >
                      <div className={`h-6 w-6 rounded-full ${color.value}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTag}>Add Tag</Button>
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
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.id}</TableCell>
                <TableCell>{tag.name}</TableCell>
                <TableCell>
                  <div className={`h-6 w-6 rounded-full ${tag.color}`} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentTag(tag)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Dialog
                      open={isEditDialogOpen && currentTag?.id === tag.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setCurrentTag(null)
                      }}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Tag</DialogTitle>
                          <DialogDescription>Update the tag details.</DialogDescription>
                        </DialogHeader>
                        {currentTag && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name">Name</Label>
                              <Input
                                id="edit-name"
                                value={currentTag.name}
                                onChange={(e) => setCurrentTag({ ...currentTag, name: e.target.value })}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-color">Color</Label>
                              <div className="grid grid-cols-3 gap-2">
                                {colorOptions.map((color) => (
                                  <div
                                    key={color.value}
                                    className={`flex h-10 cursor-pointer items-center justify-center rounded-md border ${
                                      currentTag.color === color.value ? "ring-2 ring-primary" : ""
                                    }`}
                                    onClick={() => setCurrentTag({ ...currentTag, color: color.value })}
                                  >
                                    <div className={`h-6 w-6 rounded-full ${color.value}`} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleEditTag}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => {
                        setCurrentTag(tag)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <Dialog
                      open={isDeleteDialogOpen && currentTag?.id === tag.id}
                      onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open)
                        if (!open) setCurrentTag(null)
                      }}
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Tag</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this tag? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        {currentTag && (
                          <div className="py-4">
                            <p>
                              You are about to delete the tag: <strong>{currentTag.name}</strong>
                            </p>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDeleteTag}>
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
