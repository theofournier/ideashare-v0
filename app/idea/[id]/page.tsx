import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getIdeaById } from "@/lib/actions"
import { VoteButton } from "@/components/vote-button"
import { Markdown } from "@/components/markdown"

interface IdeaDetailPageProps {
  params: {
    id: string
  }
}

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const idea = await getIdeaById(params.id)

  if (!idea) {
    return notFound()
  }

  const user = idea.profiles

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
          <VoteButton ideaId={idea.id} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 overflow-hidden rounded-lg">
            <Image
              src={idea.image_url || "/placeholder.svg?height=400&width=800"}
              alt={idea.title}
              width={800}
              height={400}
              className="w-full object-cover"
            />
          </div>

          <div className="prose prose-invert max-w-none">
            <Markdown content={idea.full_description} />
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
                  {idea.tags?.map((tag) => (
                    <Badge key={tag.id} className={`${tag.color} text-white`}>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Suggested Tech Stack</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {idea.tech_stack.map((tech) => (
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
                        src={user.avatar_url || "/placeholder.svg?height=32&width=32"}
                        alt={user.full_name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="ml-2 font-medium">{user.full_name || user.username || "Anonymous"}</span>
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
                  {new Date(idea.created_at).toLocaleDateString("en-US", {
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
