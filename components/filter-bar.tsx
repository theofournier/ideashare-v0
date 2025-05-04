"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import type { Tag, Difficulty } from "@/lib/mock-data"

interface FilterBarProps {
  tags: Tag[]
  techOptions?: string[]
  onFilterChange: (filters: {
    search: string
    difficulty: Difficulty | "All"
    tags: string[]
    techStack?: string[]
  }) => void
}

export function FilterBar({ tags, techOptions = [], onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedTech, setSelectedTech] = useState<string[]>([])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange({
      search: e.target.value,
      difficulty,
      tags: selectedTags,
      techStack: selectedTech,
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

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
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

      {(selectedTags.length > 0 || selectedTech.length > 0 || difficulty !== "All") && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
