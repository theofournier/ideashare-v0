"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Tag, Difficulty } from "@/lib/mock-data"

interface FilterBarProps {
  tags: Tag[]
  onFilterChange: (filters: {
    search: string
    difficulty: Difficulty | "All"
    tags: string[]
  }) => void
}

export function FilterBar({ tags, onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange({ search: e.target.value, difficulty, tags: selectedTags })
  }

  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty | "All"
    setDifficulty(newDifficulty)
    onFilterChange({ search, difficulty: newDifficulty, tags: selectedTags })
  }

  const toggleTag = (tagId: string) => {
    const newTags = selectedTags.includes(tagId) ? selectedTags.filter((id) => id !== tagId) : [...selectedTags, tagId]

    setSelectedTags(newTags)
    onFilterChange({ search, difficulty, tags: newTags })
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ideas..." className="pl-8" value={search} onChange={handleSearchChange} />
        </div>
        <Select value={difficulty} onValueChange={handleDifficultyChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
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
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            className={`cursor-pointer ${selectedTags.includes(tag.id) ? `${tag.color} text-white` : ""}`}
            onClick={() => toggleTag(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTags([])
              onFilterChange({ search, difficulty, tags: [] })
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
