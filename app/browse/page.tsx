import { Suspense } from "react"
import { getTags, getTechStacks } from "@/lib/supabase/data"
import { seedInitialIdea } from "@/lib/supabase/seed-idea"
import { seedTagsAndTechStacks } from "@/lib/supabase/seed-metadata"
import BrowseClient from "./browse-client"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Initialize with empty arrays in case of errors
  let tags: any[] = []
  let techStacks: string[] = []

  // Seed tags and tech stacks if needed
  try {
    await seedTagsAndTechStacks()
  } catch (error) {
    console.error("Error seeding tags and tech stacks:", error)
  }

  // Seed an initial idea if needed
  try {
    await seedInitialIdea()
  } catch (error) {
    console.error("Error seeding initial idea:", error)
  }

  // Get all tags and tech stacks for filters
  try {
    tags = await getTags()
    techStacks = await getTechStacks()
  } catch (error) {
    console.error("Error fetching filters data:", error)
    // Continue with empty arrays
  }

  // Parse search params
  const page = searchParams.page ? Number.parseInt(searchParams.page as string) : 1
  const search = (searchParams.search as string) || ""
  const difficulty = (searchParams.difficulty as string) || "All"

  // Handle multiple tags and tech stacks
  const tagsParam = searchParams.tags
  const tags_array = Array.isArray(tagsParam) ? tagsParam : tagsParam ? [tagsParam] : []

  const techParam = searchParams.techStack
  const tech_array = Array.isArray(techParam) ? techParam : techParam ? [techParam] : []

  const sort = (searchParams.sort as "newest" | "oldest" | "most-upvoted" | "title-asc" | "title-desc") || "newest"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Tech Project Ideas</h1>
        <p className="text-muted-foreground">Discover and explore tech project ideas shared by the community</p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
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
        }
      >
        <BrowseClient
          initialPage={page}
          initialSearch={search}
          initialDifficulty={difficulty}
          initialTags={tags_array}
          initialTechStack={tech_array}
          initialSort={sort}
          tags={tags}
          techStacks={techStacks}
        />
      </Suspense>
    </div>
  )
}
