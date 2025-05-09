"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { type Idea, type Tag, getTagById } from "@/lib/mock-data"

interface IdeaCardProps {
  idea: Idea
  isUpvoted?: boolean
  onUpvote?: (id: string) => void
}

export function IdeaCard({ idea, isUpvoted = false, onUpvote }: IdeaCardProps) {
  const tags = idea.tags.map((tagId) => getTagById(tagId)).filter(Boolean) as Tag[]

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-lg card-enhanced flex flex-col">
      <CardContent className="p-4 flex-grow">
        {/* Title and description at the top */}
        <Link href={`/idea/${idea.id}`}>
          <h3 className="mb-2 text-xl font-bold hover:text-primary">{idea.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3">{idea.shortDescription}</p>

        {/* Tags and difficulty below */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag.id} className={`${tag.color} text-white`}>
                {tag.name}
              </Badge>
            ))}
          </div>
          <Badge variant="outline">{idea.difficulty}</Badge>
        </div>

        {/* Tech Stack */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {idea.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm text-muted-foreground">{new Date(idea.createdAt).toLocaleDateString()}</span>
          <Button
            variant={isUpvoted ? "default" : "outline"}
            size="sm"
            onClick={() => onUpvote && onUpvote(idea.id)}
            className="gap-1"
          >
            <ArrowUp className="h-4 w-4" />
            <span>{idea.upvotes}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
