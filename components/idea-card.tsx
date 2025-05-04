"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { toggleVote } from "@/lib/actions"
import { useSupabase } from "@/components/supabase-provider"
import { useRouter } from "next/navigation"
import type { Idea } from "@/lib/types"

interface IdeaCardProps {
  idea: Idea
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [upvotes, setUpvotes] = useState(idea.votes_count || 0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useSupabase()
  const router = useRouter()

  const handleUpvote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upvote ideas",
      })
      router.push("/login")
      return
    }

    setIsLoading(true)
    const result = await toggleVote(idea.id)
    setIsLoading(false)

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
  }

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-4 pb-0">
        <div className="relative h-40 w-full overflow-hidden rounded-md">
          <Image
            src={idea.image_url || "/placeholder.svg?height=200&width=300"}
            alt={idea.title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {idea.tags?.map((tag) => (
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
        <p className="text-sm text-muted-foreground">{idea.short_description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm text-muted-foreground">{new Date(idea.created_at).toLocaleDateString()}</span>
          <Button
            variant={isUpvoted ? "default" : "outline"}
            size="sm"
            onClick={handleUpvote}
            disabled={isLoading}
            className="gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{upvotes}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
