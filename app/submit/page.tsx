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
import { Eye, Edit } from "lucide-react"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

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

const markdownExample = `# Project Title

## Overview
A brief introduction to your project idea.

## Features
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Technical Details
This project would use [technology](https://example.com) to implement the core functionality.

## Code Example
\`\`\`javascript
function example() {
  console.log("This is how a code snippet would look");
}
\`\`\`

## Challenges
Some potential challenges include...
`

export default function SubmitIdeaPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("Beginner")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [techStack, setTechStack] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")

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
                <div className="rounded-md border">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="edit" className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit" className="p-0">
                      <Textarea
                        id="fullDescription"
                        placeholder="Detailed explanation of your idea. Markdown is supported."
                        value={fullDescription}
                        onChange={(e) => setFullDescription(e.target.value)}
                        className="min-h-[300px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        required
                      />
                      <div className="border-t p-3">
                        <div className="text-sm text-muted-foreground">
                          <p className="mb-1">Markdown supported:</p>
                          <div className="flex flex-wrap gap-2">
                            <code className="rounded bg-muted px-1 py-0.5"># Heading</code>
                            <code className="rounded bg-muted px-1 py-0.5">**Bold**</code>
                            <code className="rounded bg-muted px-1 py-0.5">*Italic*</code>
                            <code className="rounded bg-muted px-1 py-0.5">[Link](url)</code>
                            <code className="rounded bg-muted px-1 py-0.5">- List item</code>
                            <code className="rounded bg-muted px-1 py-0.5">\`\`\`code\`\`\`</code>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => setFullDescription(markdownExample)}
                          >
                            Insert example template
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="preview" className="p-4">
                      {fullDescription ? (
                        <div className="prose prose-invert dark:prose-invert max-w-none">
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
                            {fullDescription}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                          <p>Your preview will appear here</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
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
