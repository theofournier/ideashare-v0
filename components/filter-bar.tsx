"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Tag, Difficulty } from "@/lib/types"

interface FilterBarProps {
  tags: Tag[]
}

export function FilterBar({ tags }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const initialSearch = searchParams.get("search") || ""
  const initialDifficulty = (searchParams.get("difficulty") as Difficulty | "All") || "All"
  const initialTags = searchParams.get("tags")?.split(",").filter(Boolean) || []

  const [search, setSearch] = useState(initialSearch)
  const [difficulty, setDifficulty] = useState<Difficulty | "All">(initialDifficulty)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)

  const createQueryString = (name: string, value: string | string[] | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === null || (Array.isArray(value) && value.length === 0)) {
      params.delete(name)
    } else if (Array.isArray(value)) {
      params.set(name, value.join(","))
    } else {
      params.set(name, value)
    }

    return params.toString()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value
    setSearch(newSearch)

    startTransition(() => {
      router.push(`/?${createQueryString("search", newSearch || null)}`, { scroll: false })
    })
  }

  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty | "All"
    setDifficulty(newDifficulty)

    startTransition(() => {
      router.push(`/?${createQueryString("difficulty", newDifficulty === "All" ? null : newDifficulty)}`, {
        scroll: false,
      })
    })
  }

  const toggleTag = (tagId: string) => {
    const newTags = selectedTags.includes(tagId) ? selectedTags.filter((id) => id !== tagId) : [...selectedTags, tagId]

    setSelectedTags(newTags)

    startTransition(() => {
      router.push(`/?${createQueryString("tags", newTags.length > 0 ? newTags : null)}`, { scroll: false })
    })
  }

  const clearFilters = () => {
    setSearch("")
    setDifficulty("All")
    setSelectedTags([])

    startTransition(() => {
      router.push("/", { scroll: false })
    })
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
        {(search || difficulty !== "All" || selectedTags.length > 0) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} disabled={isPending}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
