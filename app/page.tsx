"use client"

import { useState } from "react"
import { IdeaCard } from "@/components/idea-card"
import { FilterBar } from "@/components/filter-bar"
import { ideas, tags, userVotes, currentUser, type Difficulty } from "@/lib/mock-data"

export default function HomePage() {
  const [filteredIdeas, setFilteredIdeas] = useState(ideas)
  const [upvotedIdeas, setUpvotedIdeas] = useState<string[]>(userVotes[currentUser.id] || [])

  const handleFilterChange = (filters: {
    search: string
    difficulty: Difficulty | "All"
    tags: string[]
  }) => {
    const filtered = ideas.filter((idea) => {
      // Filter by search
      const matchesSearch = filters.search
        ? idea.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          idea.shortDescription.toLowerCase().includes(filters.search.toLowerCase())
        : true

      // Filter by difficulty
      const matchesDifficulty = filters.difficulty === "All" ? true : idea.difficulty === filters.difficulty

      // Filter by tags
      const matchesTags = filters.tags.length === 0 ? true : filters.tags.some((tagId) => idea.tags.includes(tagId))

      return matchesSearch && matchesDifficulty && matchesTags
    })

    setFilteredIdeas(filtered)
  }

  const handleUpvote = (ideaId: string) => {
    // Toggle upvote
    if (upvotedIdeas.includes(ideaId)) {
      setUpvotedIdeas(upvotedIdeas.filter((id) => id !== ideaId))
    } else {
      setUpvotedIdeas([...upvotedIdeas, ideaId])
    }

    // Update idea upvote count
    setFilteredIdeas(
      filteredIdeas.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            upvotes: upvotedIdeas.includes(ideaId) ? idea.upvotes - 1 : idea.upvotes + 1,
          }
        }
        return idea
      }),
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Discover Tech Project Ideas</h1>
        <p className="text-muted-foreground">Browse, upvote, and submit your own tech project ideas</p>
      </div>

      <FilterBar tags={tags} onFilterChange={handleFilterChange} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} isUpvoted={upvotedIdeas.includes(idea.id)} onUpvote={handleUpvote} />
        ))}

        {filteredIdeas.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <h3 className="text-xl font-medium">No ideas match your filters</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
