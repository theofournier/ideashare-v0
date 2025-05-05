"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import type { Tag, Difficulty } from "@/lib/mock-data"

// Update the FilterBarProps interface to include sort props
interface FilterBarProps {
  tags: Tag[]
  techOptions?: string[]
  onFilterChange: (filters: {
    search: string
    difficulty: Difficulty | "All"
    tags: string[]
    techStack?: string[]
    sort?: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc"
  }) => void
  vertical?: boolean
  sortBy?: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc"
  onSortChange?: (sort: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc") => void
}

// Update the FilterBar function to include the new props
export function FilterBar({
  tags,
  techOptions = [],
  onFilterChange,
  vertical = false,
  sortBy = "newest",
  onSortChange,
}: FilterBarProps) {
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(vertical)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange({
      search: e.target.value,
      difficulty,
      tags: selectedTags,
      techStack: selectedTech,
      sort: sortBy,
    })
  }

  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty | "All"
    setDifficulty(newDifficulty)
    onFilterChange({
      search,
      difficulty: newDifficulty,
      tags: selectedTags,
      techStack: selectedTech,
      sort: sortBy,
    })
  }

  const handleTagSelect = (tagId: string) => {
    const newTags = [...selectedTags, tagId]
    setSelectedTags(newTags)
    onFilterChange({
      search,
      difficulty,
      tags: newTags,
      techStack: selectedTech,
      sort: sortBy,
    })
  }

  const handleTagRemove = (tagId: string) => {
    const newTags = selectedTags.filter((id) => id !== tagId)
    setSelectedTags(newTags)
    onFilterChange({
      search,
      difficulty,
      tags: newTags,
      techStack: selectedTech,
      sort: sortBy,
    })
  }

  const handleTechSelect = (tech: string) => {
    const newTech = [...selectedTech, tech]
    setSelectedTech(newTech)
    onFilterChange({
      search,
      difficulty,
      tags: selectedTags,
      techStack: newTech,
      sort: sortBy,
    })
  }

  const handleTechRemove = (tech: string) => {
    const newTech = selectedTech.filter((t) => t !== tech)
    setSelectedTech(newTech)
    onFilterChange({
      search,
      difficulty,
      tags: selectedTags,
      techStack: newTech,
      sort: sortBy,
    })
  }

  const handleClearFilters = () => {
    setSelectedTags([])
    setSelectedTech([])
    setDifficulty("All")
    onFilterChange({
      search,
      difficulty: "All",
      tags: [],
      techStack: [],
      sort: sortBy,
    })
  }

  // Convert tags to combobox options
  const tagOptions: ComboboxOption[] = tags.map((tag) => ({
    value: tag.id,
    label: tag.name,
    color: tag.color,
  }))

  // Convert tech stack to combobox options
  const techStackOptions: ComboboxOption[] = techOptions.map((tech) => ({
    value: tech,
    label: tech,
  }))

  const hasActiveFilters = selectedTags.length > 0 || selectedTech.length > 0 || difficulty !== "All"

  // Add a handleSortChange function
  const handleSortChange = (value: string) => {
    const newSort = value as "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc"
    if (onSortChange) {
      onSortChange(newSort)
    } else {
      onFilterChange({
        search,
        difficulty,
        tags: selectedTags,
        techStack: selectedTech,
        sort: newSort,
      })
    }
  }

  return (
    <div className={`space-y-4 ${vertical ? "w-full" : ""}`}>
      <div className={`${vertical ? "flex flex-col gap-4" : "flex flex-col gap-4 sm:flex-row"}`}>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ideas..." className="pl-8" value={search} onChange={handleSearchChange} />
        </div>

        {vertical ? (
          // Vertical layout (sidebar) - Sort By above Difficulty
          <>
            <div className="w-full">
              <label className="text-sm font-medium mb-1.5 block">Sort By</label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="most-upvoted">Most Upvoted</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
              <Select value={difficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Difficulties</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          // Horizontal layout (toolbar) - Sort By next to search, Difficulty in More Filters
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-upvoted">Most Upvoted</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="whitespace-nowrap"
            >
              {showAdvancedFilters ? "Hide Filters" : "More Filters"}
            </Button>
          </div>
        )}
      </div>

      {showAdvancedFilters && (
        <div className={`${vertical ? "flex flex-col gap-4" : "flex flex-col gap-4 sm:flex-row"}`}>
          {!vertical && (
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
              <Select value={difficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Difficulties</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">Tags</label>
            <Combobox
              options={tagOptions}
              placeholder="Select tags"
              emptyMessage="No tags found."
              selectedValues={selectedTags}
              onSelect={handleTagSelect}
              onRemove={handleTagRemove}
              multiple={true}
            />
          </div>

          {techOptions.length > 0 && (
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Tech Stack</label>
              <Combobox
                options={techStackOptions}
                placeholder="Select tech stack"
                emptyMessage="No technologies found."
                selectedValues={selectedTech}
                onSelect={handleTechSelect}
                onRemove={handleTechRemove}
                multiple={true}
              />
            </div>
          )}
        </div>
      )}

      {hasActiveFilters && (
        <div className={`${vertical ? "" : "flex justify-end"}`}>
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
