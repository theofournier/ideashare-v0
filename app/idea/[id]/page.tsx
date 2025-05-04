"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ThumbsUp, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getIdeaById, getTagsForIdea, getUserForIdea, userVotes, currentUser } from "@/lib/mock-data"

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const idea = getIdeaById(id)

  if (!idea) {
    return notFound()
  }

  const tags = getTagsForIdea(idea)
  const user = getUserForIdea(idea)

  const initialUpvoteState = userVotes[currentUser.id]?.includes(id) || false
  // Initialize isUpvoted and upvotes using useState
  const [isUpvoted, setIsUpvoted] = useState(initialUpvoteState)
  const [upvotes, setUpvotes] = useState(idea.upvotes)

  useEffect(() => {
    // Update isUpvoted based on userVotes when the component mounts or id changes
    setIsUpvoted(userVotes[currentUser.id]?.includes(id) || false)
  }, [id])

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted)
    setUpvotes(isUpvoted ? upvotes - 1 : upvotes + 1)
  }

  // Format the description text by replacing markdown with HTML
  const formatDescription = (text: string) => {
    // Remove the markdown heading syntax
    const withoutHeadings = text.replace(/^#\s+(.*)$/gm, "<h2>$1</h2>")

    // Convert bullet points
    const withBulletPoints = withoutHeadings.replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>")

    // Add paragraph tags for text blocks
    const paragraphs = withBulletPoints
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p)
      .map((p) => {
        if (p.startsWith("<h2>") || p.startsWith("<li>")) {
          return p
        }
        return `<p>${p}</p>`
      })
      .join("")

    // Wrap lists in ul tags
    const withLists = paragraphs
      .replace(/<li>(.*?)<\/li>/g, (match) => {
        return `<ul>${match}</ul>`
      })
      .replace(/<\/li><ul>/g, "</li>")
      .replace(/<\/ul><li>/g, "<li>")

    return withLists
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to ideas
        </Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">{idea.title}</h1>
          <Button variant={isUpvoted ? "default" : "outline"} onClick={handleUpvote} className="w-full sm:w-auto">
            <ThumbsUp className="mr-2 h-4 w-4" />
            Upvote ({upvotes})
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 overflow-hidden rounded-lg">
            <Image
              src={idea.image || "/placeholder.svg"}
              alt={idea.title}
              width={800}
              height={400}
              className="w-full object-cover"
            />
          </div>

          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formatDescription(idea.fullDescription) }} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-lg font-medium">Project Details</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Difficulty</h4>
                <Badge variant="outline" className="mt-1">
                  {idea.difficulty}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge key={tag.id} className={`${tag.color} text-white`}>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Suggested Tech Stack</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {idea.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Submitted by</h4>
                <div className="mt-2 flex items-center">
                  {user ? (
                    <>
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="ml-2 font-medium">{user.name}</span>
                    </>
                  ) : (
                    <>
                      <User className="h-8 w-8 rounded-full bg-muted p-1.5" />
                      <span className="ml-2 font-medium">Unknown User</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Submitted on</h4>
                <p className="mt-1">
                  {new Date(idea.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
