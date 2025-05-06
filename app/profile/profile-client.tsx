"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IdeaCard } from "@/components/idea-card"
import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserProfile, getUserIdeas, getUserUpvotedIdeas } from "@/lib/supabase/data"
import { Skeleton } from "@/components/ui/skeleton"

interface ProfileClientProps {
  userId: string
}

export default function ProfileClient({ userId }: ProfileClientProps) {
  const [profile, setProfile] = useState<any>(null)
  const [userIdeas, setUserIdeas] = useState<any[]>([])
  const [upvotedIdeas, setUpvotedIdeas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user profile
        const profileData = await getUserProfile(userId)
        setProfile(profileData)

        // Fetch user's ideas
        const ideas = await getUserIdeas(userId)
        setUserIdeas(ideas)

        // Fetch upvoted ideas
        const upvoted = await getUserUpvotedIdeas(userId)
        setUpvotedIdeas(upvoted)
      } catch (error) {
        console.error("Error fetching profile data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [userId])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="mt-4 h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-col items-center justify-center">
        <Avatar className="mb-4 h-24 w-24">
          <AvatarImage src={profile?.avatar || "/placeholder.svg?height=96&width=96"} alt={profile?.name} />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{profile?.name}</h1>
      </div>

      <Tabs defaultValue="submitted" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submitted">My Ideas</TabsTrigger>
          <TabsTrigger value="upvoted">Upvoted Ideas</TabsTrigger>
        </TabsList>

        <TabsContent value="submitted" className="mt-6">
          {userIdeas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={{
                    id: idea.id,
                    title: idea.title,
                    shortDescription: idea.shortDescription,
                    difficulty: idea.difficulty,
                    upvotes: idea.upvotes,
                    createdAt: idea.createdAt,
                    tags: idea.tags.map((tag: any) => tag.id),
                    techStack: idea.techStack,
                    userId: idea.userId,
                  }}
                  isUpvoted={idea.isUpvoted}
                  tags={idea.tags}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-xl font-medium">You haven't submitted any ideas yet</h3>
              <p className="mt-2 text-muted-foreground">Share your first idea with the community</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upvoted" className="mt-6">
          {upvotedIdeas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upvotedIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={{
                    id: idea.id,
                    title: idea.title,
                    shortDescription: idea.shortDescription,
                    difficulty: idea.difficulty,
                    upvotes: idea.upvotes,
                    createdAt: idea.createdAt,
                    tags: idea.tags.map((tag: any) => tag.id),
                    techStack: idea.techStack,
                    userId: idea.userId,
                  }}
                  isUpvoted={true}
                  tags={idea.tags}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-xl font-medium">You haven't upvoted any ideas yet</h3>
              <p className="mt-2 text-muted-foreground">Browse ideas and upvote the ones you like</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
