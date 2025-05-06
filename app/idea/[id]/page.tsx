import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getIdeaById } from "@/lib/supabase/data"
import IdeaDetailClient from "./idea-detail-client"
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function IdeaDetailPage({ params }: { params: { id: string } }) {
  try {
    const idea = await getIdeaById(params.id)

    if (!idea) {
      console.log(`Idea with ID ${params.id} not found`)
      return notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="space-y-8">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Skeleton className="h-[600px] w-full" />
                </div>
                <div>
                  <Skeleton className="h-[400px] w-full" />
                </div>
              </div>
            </div>
          }
        >
          <IdeaDetailClient idea={idea} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error in idea detail page:", error)
    return notFound()
  }
}
