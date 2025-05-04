"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { tags, type Difficulty } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"

// Mock tech stacks data
const techStackOptions = [
  { value: "React", label: "React" },
  { value: "Next.js", label: "Next.js" },
  { value: "Node.js", label: "Node.js" },
  { value: "Python", label: "Python" },
  { value: "TensorFlow", label: "TensorFlow" },
  { value: "Django", label: "Django" },
  { value: "Vue.js", label: "Vue.js" },
  { value: "Angular", label: "Angular" },
  { value: "Express", label: "Express" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "Firebase", label: "Firebase" },
  { value: "AWS", label: "AWS" },
  { value: "Docker", label: "Docker" },
  { value: "Kubernetes", label: "Kubernetes" },
]

export default function SubmitIdeaPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("Beginner")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [techStack, setTechStack] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState("/placeholder.svg?height=200&width=300")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Convert tags to combobox options
  const tagOptions: ComboboxOption[] = tags.map((tag) => ({
    value: tag.id,
    label: tag.name,
    color: tag.color,
  }))

  const handleTagSelect = (tagId: string) => {
    setSelectedTags([...selectedTags, tagId])
  }

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId))
  }

  const handleTechStackSelect = (tech: string) => {
    setTechStack([...techStack, tech])
  }

  const handleTechStackRemove = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission with mock data
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/browse")
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Submit a New Idea</h1>
          <p className="text-muted-foreground">Share your tech project idea with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide the core details about your project idea</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a catchy title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Brief summary of your idea (1-2 sentences)"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  placeholder="Detailed explanation of your idea. Markdown is supported."
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Categorize and provide technical details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <Combobox
                  options={tagOptions}
                  placeholder="Select tags"
                  emptyMessage="No tags found."
                  selectedValues={selectedTags}
                  onSelect={handleTagSelect}
                  onRemove={handleTagRemove}
                  multiple={true}
                />
              </div>

              <div className="space-y-2">
                <Label>Tech Stack</Label>
                <Combobox
                  options={techStackOptions}
                  placeholder="Select technologies"
                  emptyMessage="No technologies found."
                  selectedValues={techStack}
                  onSelect={handleTechStackSelect}
                  onRemove={handleTechStackRemove}
                  multiple={true}
                />
              </div>

              <div className="space-y-2">
                <Label>Project Image (Optional)</Label>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-[200px] w-full overflow-hidden rounded-md border">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Project preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button type="button" variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/browse")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Idea"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
