"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import { type Idea, type Tag, getTagById } from "@/lib/mock-data"

interface IdeaCardProps {
  idea: Idea
  isUpvoted?: boolean
  onUpvote: (id: string) => void
}

export function IdeaCard({ idea, isUpvoted = false, onUpvote }: IdeaCardProps) {
  const tags = idea.tags.map((tagId) => getTagById(tagId)).filter(Boolean) as Tag[]

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-4 pb-0">
        <div className="relative h-40 w-full overflow-hidden rounded-md">
          <Image src={idea.image || "/placeholder.svg"} alt={idea.title} fill className="object-cover" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
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
        <Link href={`/idea/${idea.id}`}>
          <h3 className="mb-2 text-xl font-bold hover:text-primary">{idea.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">{idea.shortDescription}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm text-muted-foreground">{new Date(idea.createdAt).toLocaleDateString()}</span>
          <Button
            variant={isUpvoted ? "default" : "outline"}
            size="sm"
            onClick={() => onUpvote(idea.id)}
            className="gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{idea.upvotes}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
