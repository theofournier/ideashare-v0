"use client"

import { useEffect, useState } from "react"
import { IdeaCard } from "@/components/idea-card"
import { getIdeas } from "@/lib/actions"
import type { Idea } from "@/lib/types"

export function IdeaGrid() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchIdeas() {
      setIsLoading(true)
      const fetchedIdeas = await getIdeas()
      setIdeas(fetchedIdeas)
      setIsLoading(false)
    }

    fetchIdeas()
  }, [])

  if (isLoading) {
    return <div className="py-12 text-center">Loading ideas...</div>
  }

  if (ideas.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-xl font-medium">No ideas found</h3>
        <p className="mt-2 text-muted-foreground">Be the first to submit an idea!</p>
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
