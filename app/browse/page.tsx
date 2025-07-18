"use client"

import { useState, useEffect } from "react"
import { ideas, tags, type Difficulty } from "@/lib/mock-data"
import { FilterBar } from "@/components/filter-bar"
import { IdeaCard } from "@/components/idea-card"
import { IdeaListItem } from "@/components/idea-list-item"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { ChevronRight, LayoutGrid, List } from "lucide-react"

// Get unique tech stack items from all ideas
const allTechStacks = Array.from(new Set(ideas.flatMap((idea) => idea.techStack))).sort()

// Number of ideas to display per page
const ITEMS_PER_PAGE = 6

export default function BrowsePage() {
  const [filteredIdeas, setFilteredIdeas] = useState(ideas)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.ceil(ideas.length / ITEMS_PER_PAGE))
  const [paginatedIdeas, setPaginatedIdeas] = useState<typeof ideas>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc">("newest")
  // Add a new state for view mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Add these state variables to track filter state
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedTech, setSelectedTech] = useState<string[]>([])

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Update the handleFilterChange function to include sorting
  const handleFilterChange = (filters: {
    search: string
    difficulty: Difficulty | "All"
    tags: string[]
    techStack?: string[]
    sort?: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc"
  }) => {
    const { search, difficulty, tags, techStack, sort } = filters

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

    // Apply sorting if provided
    if (sort) {
      setSortBy(sort)
    }

    // Sort the filtered ideas
    const sortedIdeas = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "most-upvoted":
          return b.upvotes - a.upvotes
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredIdeas(sortedIdeas)
    setTotalPages(Math.ceil(sortedIdeas.length / ITEMS_PER_PAGE))
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Add a handleSortChange function
  const handleSortChange = (sort: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc") => {
    handleFilterChange({
      search,
      difficulty,
      tags: selectedTags,
      techStack: selectedTech,
      sort,
    })
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Toggle between grid and list view
  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Tech Project Ideas</h1>
        <p className="text-muted-foreground">Discover and explore tech project ideas shared by the community</p>
      </div>

      {/* Mobile filter bar - only shown on small screens */}
      <div className="lg:hidden sticky top-16 z-10 -mx-4 bg-background px-4 py-4 transition-shadow border-b border-border/40 backdrop-blur-sm">
        <FilterBar
          tags={tags}
          techOptions={allTechStacks}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Desktop layout with sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar for filters - only visible on desktop */}
        <aside
          className={`hidden lg:block sticky top-24 h-[calc(100vh-12rem)] overflow-auto transition-all duration-300 ${
            sidebarCollapsed ? "w-12" : "w-80"
          }`}
        >
          <div className="bg-background border rounded-lg p-4 h-full">
            {sidebarCollapsed ? (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="w-full h-8 flex justify-center">
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
                <FilterBar
                  tags={tags}
                  techOptions={allTechStacks}
                  onFilterChange={handleFilterChange}
                  vertical={true}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                />
              </>
            )}
          </div>
        </aside>

        {/* Main content area */}
        <div className={`flex-1 ${sidebarCollapsed ? "lg:ml-4" : "lg:ml-6"}`}>
          {/* View mode toggle */}
          <div className="flex justify-end mb-4">
            <div className="bg-muted inline-flex rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-sm"
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-sm"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filteredIdeas.length === 0 ? (
            <div className="mt-12 text-center">
              <h3 className="text-xl font-medium">No ideas match your filters</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              {/* Conditional rendering based on view mode */}
              {viewMode === "grid" ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedIdeas.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {paginatedIdeas.map((idea) => (
                    <IdeaListItem key={idea.id} idea={idea} />
                  ))}
                </div>
              )}

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
      </div>
    </div>
  )
}
