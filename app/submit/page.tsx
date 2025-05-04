"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSupabase } from "@/components/supabase-provider"
import { createIdea, getTags } from "@/lib/actions"
import { useEffect } from "react"
import type { Tag, Difficulty } from "@/lib/types"

export default function SubmitIdeaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useSupabase()

  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("Beginner")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [techStack, setTechStack] = useState<string[]>([])
  const [techInput, setTechInput] = useState("")
  const [imagePreview, setImagePreview] = useState("/placeholder.svg?height=200&width=300")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTags() {
      const fetchedTags = await getTags()
      setTags(fetchedTags)
      setIsLoading(false)
    }

    loadTags()
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit ideas",
      })
      router.push("/login")
    }
  }, [user, authLoading, router, toast])

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const addTechStack = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()])
      setTechInput("")
    }
  }

  const removeTechStack = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("shortDescription", shortDescription)
      formData.append("fullDescription", fullDescription)
      formData.append("difficulty", difficulty)
      formData.append("techStack", JSON.stringify(techStack))
      formData.append("imageUrl", imagePreview)

      selectedTags.forEach((tagId) => {
        formData.append("tags", tagId)
      })

      await createIdea(formData)

      toast({
        title: "Success",
        description: "Your idea has been submitted successfully!",
      })

      router.push("/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit idea. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || authLoading) {
    return <div className="flex justify-center py-12">Loading...</div>
  }

  return (
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
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className={`cursor-pointer ${selectedTags.includes(tag.id) ? `${tag.color} text-white` : ""}`}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTechStack()
                    }
                  }}
                />
                <Button type="button" onClick={addTechStack}>
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="gap-1">
                    {tech}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTechStack(tech)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Image</Label>
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
          <Button type="button" variant="outline" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Idea"}
          </Button>
        </div>
      </form>
    </div>
  )
}
