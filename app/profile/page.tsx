"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IdeaCard } from "@/components/idea-card"
import { ideas, userIdeas, userVotes, currentUser } from "@/lib/mock-data"
import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const [upvotedIdeas, setUpvotedIdeas] = useState<string[]>(userVotes[currentUser.id] || [])

  const userSubmittedIdeas = ideas.filter((idea) => userIdeas[currentUser.id]?.includes(idea.id))

  const userLikedIdeas = ideas.filter((idea) => upvotedIdeas.includes(idea.id))

  const handleUpvote = (ideaId: string) => {
    // Toggle upvote
    if (upvotedIdeas.includes(ideaId)) {
      setUpvotedIdeas(upvotedIdeas.filter((id) => id !== ideaId))
    } else {
      setUpvotedIdeas([...upvotedIdeas, ideaId])
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-center justify-center">
        <Avatar className="mb-4 h-24 w-24">
          <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{currentUser.name}</h1>
        <p className="text-muted-foreground">{currentUser.email}</p>
      </div>

      <Tabs defaultValue="submitted" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submitted">My Ideas</TabsTrigger>
          <TabsTrigger value="upvoted">Upvoted Ideas</TabsTrigger>
        </TabsList>

        <TabsContent value="submitted" className="mt-6">
          {userSubmittedIdeas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userSubmittedIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  isUpvoted={upvotedIdeas.includes(idea.id)}
                  onUpvote={handleUpvote}
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
          {userLikedIdeas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userLikedIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} isUpvoted={true} onUpvote={handleUpvote} />
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
