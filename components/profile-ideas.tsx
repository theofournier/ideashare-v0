"use client"

import { IdeaCard } from "@/components/idea-card"
import type { Idea } from "@/lib/types"

interface ProfileIdeasProps {
  ideas: Idea[]
  emptyMessage: string
}

export function ProfileIdeas({ ideas, emptyMessage }: ProfileIdeasProps) {
  if (ideas.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-xl font-medium">{emptyMessage}</h3>
        <p className="mt-2 text-muted-foreground">Browse ideas and get inspired!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  )
}
