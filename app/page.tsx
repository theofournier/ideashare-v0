import { Suspense } from "react"
import { IdeaGrid } from "@/components/idea-grid"
import { FilterBar } from "@/components/filter-bar"
import { getTags } from "@/lib/actions"
import { Skeleton } from "@/components/ui/skeleton"

export default async function HomePage() {
  const tags = await getTags()

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Discover Tech Project Ideas</h1>
        <p className="text-muted-foreground">Browse, upvote, and submit your own tech project ideas</p>
      </div>

      <FilterBar tags={tags} />

      <Suspense fallback={<IdeasSkeleton />}>
        <IdeaGrid />
      </Suspense>
    </div>
  )
}

function IdeasSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-40 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
    </div>
  )
}
