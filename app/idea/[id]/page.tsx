"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ThumbsUp, Flag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getIdeaById, getTagsForIdea, getUserForIdea, userVotes, currentUser, ideas } from "@/lib/mock-data"
import { ReportIdeaModal } from "@/components/report-idea-modal"
import { SimilarIdeas } from "@/components/similar-ideas"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const idea = getIdeaById(id)

  if (!idea) {
    return notFound()
  }

  const tags = getTagsForIdea(idea)
  const user = getUserForIdea(idea)

  // Initialize state variables outside the useEffect hook
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [upvotes, setUpvotes] = useState(0)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  useEffect(() => {
    // Update isUpvoted based on userVotes when the component mounts or id changes
    setIsUpvoted(userVotes[currentUser.id]?.includes(id) || false)
    setUpvotes(idea.upvotes) // Initialize upvotes here
  }, [id, idea.upvotes])

  const handleUpvote = () => {
    setIsUpvoted(!isUpvoted)
    setUpvotes(isUpvoted ? upvotes - 1 : upvotes + 1)
  }

  // Find similar ideas based on tags and tech stack
  const similarIdeas = ideas
    .filter(
      (otherIdea) =>
        otherIdea.id !== id && // Not the current idea
        // Has at least one common tag
        (otherIdea.tags.some((tag) => idea.tags.includes(tag)) ||
          // Has at least one common tech stack item
          otherIdea.techStack.some((tech) => idea.techStack.includes(tech))),
    )
    .sort((a, b) => {
      // Count common tags and tech stack items
      const aCommonTags = a.tags.filter((tag) => idea.tags.includes(tag)).length
      const aCommonTech = a.techStack.filter((tech) => idea.techStack.includes(tech)).length
      const aTotal = aCommonTags + aCommonTech

      const bCommonTags = b.tags.filter((tag) => idea.tags.includes(tag)).length
      const bCommonTech = b.techStack.filter((tech) => idea.techStack.includes(tech)).length
      const bTotal = bCommonTags + bCommonTech

      // Sort by most similar first
      return bTotal - aTotal
    })
    .slice(0, 6) // Get top 6 similar ideas

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/browse"
          className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to ideas
        </Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">{idea.title}</h1>
            <p className="mt-2 text-muted-foreground">{idea.shortDescription}</p>
          </div>
          <div className="flex gap-2">
            <Button variant={isUpvoted ? "default" : "outline"} onClick={handleUpvote} className="w-full sm:w-auto">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Upvote ({upvotes})
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsReportModalOpen(true)} title="Report this idea">
              <Flag className="h-4 w-4" />
              <span className="sr-only">Report</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {idea.image && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <Image
                src={idea.image || "/placeholder.svg"}
                alt={idea.title}
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          )}

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
              {idea.fullDescription}
            </ReactMarkdown>
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

          {/* Similar Ideas */}
          {similarIdeas.length > 0 && (
            <div className="rounded-lg border p-4">
              <SimilarIdeas currentIdeaId={id} similarIdeas={similarIdeas} />
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportIdeaModal
        ideaId={id}
        ideaTitle={idea.title}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  )
}
