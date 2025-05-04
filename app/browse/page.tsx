"use client"

import { useState } from "react"
import { ideas, tags, type Difficulty } from "@/lib/mock-data"
import { FilterBar } from "@/components/filter-bar"
import { IdeaCard } from "@/components/idea-card"

// Get unique tech stack items from all ideas
const allTechStacks = Array.from(new Set(ideas.flatMap((idea) => idea.techStack))).sort()

// Add container class and padding to the browse page
export default function BrowsePage() {
  const [filteredIdeas, setFilteredIdeas] = useState(ideas)

  const handleFilterChange = (filters: {
    search: string
    difficulty: Difficulty | "All"
    tags: string[]
    techStack?: string[]
  }) => {
    const { search, difficulty, tags, techStack } = filters

    const filtered = ideas.filter((idea) => {
      // Filter by search term
      const matchesSearch =
        search === "" ||
        idea.title.toLowerCase().includes(search.toLowerCase()) ||
        idea.shortDescription.toLowerCase().includes(search.toLowerCase())

      // Filter by difficulty
      const matchesDifficulty = difficulty === "All" || idea.difficulty === difficulty

      // Filter by tags
      const matchesTags = tags.length === 0 || tags.some((tag) => idea.tags.includes(tag))

      // Filter by tech stack
      const matchesTechStack =
        !techStack || techStack.length === 0 || techStack.some((tech) => idea.techStack.includes(tech))

      return matchesSearch && matchesDifficulty && matchesTags && matchesTechStack
    })

    setFilteredIdeas(filtered)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Tech Project Ideas</h1>
        <p className="text-muted-foreground">Discover and explore tech project ideas shared by the community</p>
      </div>

      <FilterBar tags={tags} techOptions={allTechStacks} onFilterChange={handleFilterChange} />

      {filteredIdeas.length === 0 ? (
        <div className="mt-12 text-center">
          <h3 className="text-xl font-medium">No ideas match your filters</h3>
          <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  )
}
