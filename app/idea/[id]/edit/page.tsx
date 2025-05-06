"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getIdeaById, tags, currentUser, getUserById } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { MultiSelect } from "@/components/ui/multi-select"

// Simple markdown preview component
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"]
const techStackOptions = [
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Ruby on Rails",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Firebase",
  "Supabase",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "TailwindCSS",
  "Bootstrap",
  "Material UI",
  "Chakra UI",
]

export default function EditIdeaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [idea, setIdea] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    difficulty: "",
    tags: [] as string[],
    techStack: [] as string[],
  })

  // Get the idea ID from the URL
  const id = typeof window !== "undefined" ? window.location.pathname.split("/")[2] : ""

  useEffect(() => {
    if (id) {
      const fetchedIdea = getIdeaById(id)
      if (!fetchedIdea) {
        return notFound()
      }

      // Check if user is authorized (admin or idea owner)
      const user = getUserById(currentUser.id)
      const isAdmin = user?.role === "admin"
      const isOwner = fetchedIdea.userId === currentUser.id

      if (!isAdmin && !isOwner) {
        toast({
          title: "Unauthorized",
          description: "You don't have permission to edit this idea",
          variant: "destructive",
        })
        router.push(`/idea/${id}`)
        return
      }

      setIdea(fetchedIdea)
      setFormData({
        title: fetchedIdea.title,
        shortDescription: fetchedIdea.shortDescription,
        fullDescription: fetchedIdea.fullDescription,
        difficulty: fetchedIdea.difficulty,
        tags: fetchedIdea.tags,
        techStack: fetchedIdea.techStack,
      })
    }
  }, [id, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to update the idea
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Idea updated",
        description: "Your idea has been successfully updated",
      })

      // Redirect to the idea detail page
      router.push(`/idea/${id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update idea. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/idea/${id}`}
          className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to idea
        </Link>
        <h1 className="text-3xl font-bold">Edit Idea</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a title for your idea"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="A brief summary of your idea (max 150 characters)"
                  maxLength={150}
                  rows={2}
                  required
                />
                <p className="text-xs text-muted-foreground text-right">{formData.shortDescription.length}/150</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Full Description</Label>
                <Tabs defaultValue="write">
                  <TabsList className="mb-2">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="write">
                    <Textarea
                      id="fullDescription"
                      name="fullDescription"
                      value={formData.fullDescription}
                      onChange={handleInputChange}
                      placeholder="Describe your idea in detail. Markdown is supported."
                      rows={12}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Markdown is supported. You can use **bold**, *italic*, `code`, etc.
                    </p>
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="border rounded-md p-4 min-h-[300px] prose prose-invert dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "")
                            return !inline && match ? (
                              <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          },
                        }}
                      >
                        {formData.fullDescription || "Nothing to preview"}
                      </ReactMarkdown>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange("difficulty", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <MultiSelect
                  options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
                  selected={formData.tags}
                  onChange={(values) => handleMultiSelectChange("tags", values)}
                  placeholder="Select tags"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="techStack">Tech Stack</Label>
                <MultiSelect
                  options={techStackOptions.map((tech) => ({ label: tech, value: tech }))}
                  selected={formData.techStack}
                  onChange={(values) => handleMultiSelectChange("techStack", values)}
                  placeholder="Select technologies"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push(`/idea/${id}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
