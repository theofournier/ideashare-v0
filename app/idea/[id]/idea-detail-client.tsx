"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUp, Flag, User, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ReportIdeaModal } from "@/components/report-idea-modal"
import { SimilarIdeas } from "@/components/similar-ideas"
import { useAuth } from "@/lib/supabase/auth-context"
import { toggleUpvote } from "@/lib/supabase/ideas"
import { useToast } from "@/hooks/use-toast"
import { getSimilarIdeas } from "@/lib/supabase/data"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import Image from "next/image"

interface IdeaDetailClientProps {
  idea: any
}

export default function IdeaDetailClient({ idea }: IdeaDetailClientProps) {
  const [isUpvoted, setIsUpvoted] = useState(idea.isUpvoted)
  const [upvotes, setUpvotes] = useState(idea.upvotes)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [similarIdeas, setSimilarIdeas] = useState<any[]>([])
  const [loadingSimilar, setLoadingSimilar] = useState(true)

  const { user } = useAuth()
  const { toast } = useToast()

  const canEdit = user?.id === idea.userId

  // Fetch similar ideas
  useEffect(() => {
    const fetchSimilarIdeas = async () => {
      try {
        const similar = await getSimilarIdeas(idea.id)
        setSimilarIdeas(similar)
      } catch (error) {
        console.error("Error fetching similar ideas:", error)
      } finally {
        setLoadingSimilar(false)
      }
    }

    fetchSimilarIdeas()
  }, [idea.id])

  const handleUpvote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote ideas",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await toggleUpvote(idea.id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.action === "added") {
        setIsUpvoted(true)
        setUpvotes(upvotes + 1)
      } else {
        setIsUpvoted(false)
        setUpvotes(upvotes - 1)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update upvote",
        variant: "destructive",
      })
    }
  }

  return (
    <>
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
            {canEdit && (
              <Button variant="outline" asChild>
                <Link href={`/idea/${idea.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            )}
            <Button variant={isUpvoted ? "default" : "outline"} onClick={handleUpvote} className="w-full sm:w-auto">
              <ArrowUp className="mr-2 h-4 w-4" />
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
          <div className="rounded-lg border p-4 card-enhanced">
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
                  {idea.tags.map((tag: any) => (
                    <Badge key={tag.id} className={`${tag.color} text-white`}>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Suggested Tech Stack</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {idea.techStack.map((tech: string) => (
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
                  {idea.user ? (
                    <>
                      <Image
                        src={idea.user.avatar || "/placeholder.svg?height=32&width=32"}
                        alt={idea.user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="ml-2 font-medium">{idea.user.name}</span>
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
          {!loadingSimilar && similarIdeas.length > 0 && (
            <div className="rounded-lg border p-4 card-enhanced">
              <SimilarIdeas currentIdeaId={idea.id} similarIdeas={similarIdeas} />
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportIdeaModal
        ideaId={idea.id}
        ideaTitle={idea.title}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </>
  )
}
