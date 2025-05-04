"use client"

import { useState, useEffect } from "react"
import { ideas, tags, type Difficulty } from "@/lib/mock-data"
import { FilterBar } from "@/components/filter-bar"
import { IdeaCard } from "@/components/idea-card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Get unique tech stack items from all ideas
const allTechStacks = Array.from(new Set(ideas.flatMap((idea) => idea.techStack))).sort()

// Number of ideas to display per page
const ITEMS_PER_PAGE = 6

export default function BrowsePage() {
  const [filteredIdeas, setFilteredIdeas] = useState(ideas)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.ceil(ideas.length / ITEMS_PER_PAGE))
  const [paginatedIdeas, setPaginatedIdeas] = useState<typeof ideas>([])

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
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE))
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Update paginated ideas whenever filtered ideas or current page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    setPaginatedIdeas(filteredIdeas.slice(startIndex, endIndex))
  }, [filteredIdeas, currentPage])

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Show at most 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Calculate start and end of page numbers to show
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning or end
      if (currentPage <= 2) {
        endPage = 3
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis1")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis2")
      }

      // Always include last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Tech Project Ideas</h1>
        <p className="text-muted-foreground">Discover and explore tech project ideas shared by the community</p>
      </div>

      {/* Sticky filter bar container */}
      <div className="sticky top-16 z-10 -mx-4 bg-background px-4 py-4 transition-shadow border-b border-border/40 backdrop-blur-sm">
        <FilterBar tags={tags} techOptions={allTechStacks} onFilterChange={handleFilterChange} />
      </div>

      {filteredIdeas.length === 0 ? (
        <div className="mt-12 text-center">
          <h3 className="text-xl font-medium">No ideas match your filters</h3>
          <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(currentPage - 1)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                    />
                  </PaginationItem>
                )}

                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis1" || page === "ellipsis2" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page as number)
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(currentPage + 1)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {paginatedIdeas.length} of {filteredIdeas.length} ideas
          </div>
        </>
      )}
    </div>
  )
}
