import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { getSession, getUserDetails } from "@/lib/supabase-server"
import { getUserIdeas, getUserVotes } from "@/lib/actions"
import { ProfileIdeas } from "@/components/profile-ideas"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const userDetails = await getUserDetails()
  const userSubmittedIdeas = await getUserIdeas(session.user.id)
  const userVotedIdeas = await getUserVotes(session.user.id)

  return (
    <div>
      <div className="mb-8 flex flex-col items-center justify-center">
        <Avatar className="mb-4 h-24 w-24">
          <AvatarImage
            src={userDetails?.avatar_url || "/placeholder.svg?height=96&width=96"}
            alt={userDetails?.full_name || ""}
          />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">
          {userDetails?.full_name || userDetails?.username || session.user.email?.split("@")[0]}
        </h1>
        <p className="text-muted-foreground">{session.user.email}</p>
      </div>

      <Tabs defaultValue="submitted" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submitted">My Ideas</TabsTrigger>
          <TabsTrigger value="upvoted">Upvoted Ideas</TabsTrigger>
        </TabsList>

        <TabsContent value="submitted" className="mt-6">
          <ProfileIdeas ideas={userSubmittedIdeas} emptyMessage="You haven't submitted any ideas yet" />
        </TabsContent>

        <TabsContent value="upvoted" className="mt-6">
          <ProfileIdeas ideas={userVotedIdeas} emptyMessage="You haven't upvoted any ideas yet" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
