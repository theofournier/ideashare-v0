"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"

interface FilterBarProps {
  tags: { id: string; name: string; color: string }[]
  techOptions: string[]
  onFilterChange: (filters: {
    search: string
    difficulty: string
    tags: string[]
    techStack?: string[]
    sort?: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc"
  }) => void
  vertical?: boolean
  sortBy?: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc"
  onSortChange?: (sort: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc") => void
  initialSearch?: string
  initialDifficulty?: string
  initialTags?: string[]
  initialTechStack?: string[]
}

export function FilterBar({
  tags,
  techOptions,
  onFilterChange,
  vertical = false,
  sortBy = "newest",
  onSortChange,
  initialSearch = "",
  initialDifficulty = "All",
  initialTags = [],
  initialTechStack = [],
}: FilterBarProps) {
  const [search, setSearch] = useState(initialSearch)
  const [difficulty, setDifficulty] = useState<string>(initialDifficulty)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
  const [selectedTech, setSelectedTech] = useState<string[]>(initialTechStack)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Apply filters when they change
  useEffect(() => {
    onFilterChange({
      search,
      difficulty,
      tags: selectedTags,
      techStack: selectedTech,
    })
  }, [search, difficulty, selectedTags, selectedTech, onFilterChange])

  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  const handleTechSelect = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech))
    } else {
      setSelectedTech([...selectedTech, tech])
    }
  }

  const clearFilters = () => {
    setSearch("")
    setDifficulty("All")
    setSelectedTags([])
    setSelectedTech([])
  }

  const handleSortChange = (value: string) => {
    if (onSortChange) {
      onSortChange(value as "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc")
    }
  }

  if (vertical) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search ideas..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="sort" className="text-sm font-medium">
            Sort By
          </label>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger id="sort">
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

        <div className="space-y-2">
          <label htmlFor="difficulty" className="text-sm font-medium">
            Difficulty
          </label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Difficulties</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className={selectedTags.includes(tag.id) ? `${tag.color} text-white` : ""}
                onClick={() => handleTagSelect(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tech Stack</label>
          <MultiSelect
            options={techOptions.map((tech) => ({ label: tech, value: tech }))}
            selected={selectedTech}
            onChange={setSelectedTech}
            placeholder="Select technologies"
          />
        </div>

        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          Clear Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
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
            size="icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="mobile-difficulty" className="text-sm font-medium">
                Difficulty
              </label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="mobile-difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Difficulties</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Stack</label>
              <MultiSelect
                options={techOptions.map((tech) => ({ label: tech, value: tech }))}
                selected={selectedTech}
                onChange={setSelectedTech}
                placeholder="Select technologies"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className={selectedTags.includes(tag.id) ? `${tag.color} text-white` : ""}
                  onClick={() => handleTagSelect(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
