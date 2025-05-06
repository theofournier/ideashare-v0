"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Number of ideas to display per page
const ITEMS_PER_PAGE = 6

interface Tag {
  id: string
  name: string
  color: string
}

interface BrowseClientProps {
  initialPage: number
  initialSearch: string
  initialDifficulty: string
  initialTags: string[]
  initialTechStack: string[]
  initialSort: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc"
  tags: Tag[]
  techStacks: string[]
}

export default function BrowseClient({
  initialPage,
  initialSearch,
  initialDifficulty,
  initialTags,
  initialTechStack,
  initialSort,
  tags = [], // Default to empty array if not provided
  techStacks = [], // Default to empty array if not provided
}: BrowseClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Use a ref to store the Supabase client to prevent it from being recreated on each render
  const supabaseRef = useRef<SupabaseClient<Database> | null>(null)
  if (!supabaseRef.current) {
    supabaseRef.current = createClientComponentClient<Database>()
  }
  const supabase = supabaseRef.current

  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Track if the component is mounted to prevent state updates after unmount
  const isMounted = useRef(true)

  // Filter states
  const [search, setSearch] = useState(initialSearch)
  const [difficulty, setDifficulty] = useState(initialDifficulty)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
  const [selectedTech, setSelectedTech] = useState<string[]>(initialTechStack)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc">(initialSort)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

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

  // Fetch ideas based on filters
  useEffect(() => {
    let isCancelled = false

    async function fetchIdeas() {
      if (!isMounted.current) return

      setLoading(true)
      setError(null)

      try {
        // Start building the query
        let query = supabase.from("ideas").select(`*`, { count: "exact" }).eq("status", "published")

        // Apply search filter
        if (search) {
          query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`)
        }

        // Apply difficulty filter
        if (difficulty !== "All") {
          query = query.eq("difficulty", difficulty)
        }

        // Apply sorting
        switch (sortBy) {
          case "newest":
            query = query.order("created_at", { ascending: false })
            break
          case "oldest":
            query = query.order("created_at", { ascending: true })
            break
          case "most-upvoted":
            query = query.order("upvotes", { ascending: false })
            break
          case "title-asc":
            query = query.order("title", { ascending: true })
            break
          case "title-desc":
            query = query.order("title", { ascending: false })
            break
          default:
            query = query.order("created_at", { ascending: false })
        }

        // Apply pagination
        const from = (currentPage - 1) * ITEMS_PER_PAGE
        const to = from + ITEMS_PER_PAGE - 1
        query = query.range(from, to)

        const { data, count, error } = await query

        if (isCancelled || !isMounted.current) return

        if (error) {
          console.error("Error fetching ideas:", error)
          setError("Failed to load ideas. Please try again later.")
          setLoading(false)
          return
        }

        // Get the user's upvotes
        const { data: session } = await supabase.auth.getSession()
        let userUpvotes: string[] = []

        if (session?.session?.user) {
          const { data: upvotesData } = await supabase
            .from("user_votes")
            .select("idea_id")
            .eq("user_id", session.session.user.id)

          userUpvotes = upvotesData?.map((vote) => vote.idea_id) || []
        }

        if (isCancelled || !isMounted.current) return

        // Process the data
        const processedIdeas = await Promise.all(
          (data || []).map(async (idea) => {
            // Get user profile
            const { data: userData } = await supabase
              .from("user_profiles")
              .select("*")
              .eq("id", idea.user_id)
              .maybeSingle()

            // Get tags for this idea
            const { data: tagData } = await supabase.from("idea_tags").select("tag_id").eq("idea_id", idea.id)

            const tagIds = tagData?.map((item) => item.tag_id) || []
            let ideaTags: any[] = []

            if (tagIds.length > 0) {
              const { data: tagsData } = await supabase.from("tags").select("*").in("id", tagIds)
              ideaTags =
                tagsData?.map((tag) => ({
                  id: tag.id.toString(),
                  name: tag.name,
                  color: tag.color,
                })) || []
            }

            // Get tech stack for this idea
            const { data: techData } = await supabase
              .from("idea_tech_stacks")
              .select("tech_stack_id")
              .eq("idea_id", idea.id)

            const techIds = techData?.map((item) => item.tech_stack_id) || []
            let ideaTechStack: string[] = []

            if (techIds.length > 0) {
              const { data: techStacksData } = await supabase.from("tech_stacks").select("*").in("id", techIds)
              ideaTechStack = techStacksData?.map((tech) => tech.name) || []
            }

            // Check if user has upvoted this idea
            const isUpvoted = userUpvotes.includes(idea.id)

            return {
              id: idea.id,
              title: idea.title,
              shortDescription: idea.short_description,
              difficulty: idea.difficulty,
              upvotes: idea.upvotes,
              createdAt: idea.created_at,
              userId: idea.user_id,
              tags: ideaTags,
              techStack: ideaTechStack,
              isUpvoted,
              user: {
                name: userData?.full_name || "Unknown",
                avatar: userData?.avatar_url || null,
              },
            }
          }),
        )

        if (isCancelled || !isMounted.current) return

        // Apply client-side filtering for tags and tech stack
        let filteredIdeas = processedIdeas

        if (selectedTags.length > 0) {
          filteredIdeas = filteredIdeas.filter((idea) => idea.tags.some((tag: any) => selectedTags.includes(tag.id)))
        }

        if (selectedTech.length > 0) {
          filteredIdeas = filteredIdeas.filter((idea) =>
            idea.techStack.some((tech: string) => selectedTech.includes(tech)),
          )
        }

        setIdeas(filteredIdeas)
        setTotalCount(count || 0)
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE))
      } catch (error) {
        if (isCancelled || !isMounted.current) return
        console.error("Error in fetchIdeas:", error)
        setError("An unexpected error occurred. Please try again later.")
      } finally {
        if (!isCancelled && isMounted.current) {
          setLoading(false)
        }
      }
    }

    fetchIdeas()

    return () => {
      isCancelled = true
    }
  }, [currentPage, search, difficulty, selectedTags, selectedTech, sortBy]) // Removed supabase from dependencies

  // Update URL when filters change
  const updateUrl = (newParams: Record<string, string | string[] | number | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Update or remove each parameter
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.delete(key) // Remove existing values
        value.forEach((val) => params.append(key, val))
      } else {
        params.set(key, value.toString())
      }
    })

    router.push(`/browse?${params.toString()}`)
  }

  const handleFilterChange = (filters: {
    search: string
    difficulty: string
    tags: string[]
    techStack?: string[]
    sort?: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc"
  }) => {
    const { search, difficulty, tags, techStack, sort } = filters

    setSearch(search)
    setDifficulty(difficulty)
    setSelectedTags(tags)
    setSelectedTech(techStack || [])
    if (sort) setSortBy(sort)
    setCurrentPage(1) // Reset to first page

    // Update URL
    updateUrl({
      page: 1,
      search,
      difficulty,
      tags,
      techStack: techStack || null,
      sort: sort || null,
    })
  }

  const handleSortChange = (sort: "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc") => {
    setSortBy(sort)
    updateUrl({ sort })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateUrl({ page })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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

  return (
    <>
      {/* Mobile filter bar - only shown on small screens */}
      <div className="lg:hidden sticky top-16 z-10 -mx-4 bg-background px-4 py-4 transition-shadow border-b border-border/40 backdrop-blur-sm">
        <FilterBar
          tags={tags}
          techOptions={techStacks}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          initialValues={{
            search,
            difficulty,
            tags: selectedTags,
            techStack: selectedTech,
          }}
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
                  techOptions={techStacks}
                  onFilterChange={handleFilterChange}
                  vertical={true}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  initialValues={{
                    search,
                    difficulty,
                    tags: selectedTags,
                    techStack: selectedTech,
                  }}
                />
              </>
            )}
          </div>
        </aside>

        {/* Main content area */}
        <div className={`flex-1 ${sidebarCollapsed ? "lg:ml-4" : "lg:ml-6"}`}>
          {error ? (
            <div className="mt-12 text-center">
              <h3 className="text-xl font-medium text-red-500">Error</h3>
              <p className="mt-2 text-muted-foreground">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="mt-12 text-center">
              <h3 className="text-xl font-medium">No ideas match your filters</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {ideas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} isUpvoted={idea.isUpvoted} tags={idea.tags} />
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
                            handlePageChange(currentPage - 1)
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
                              handlePageChange(page as number)
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
                            handlePageChange(currentPage + 1)
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Showing {ideas.length} of {totalCount} ideas
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
