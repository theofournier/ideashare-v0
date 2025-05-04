"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { toggleVote, getVoteCount, checkUserVote } from "@/lib/actions"
import { useSupabase } from "@/components/supabase-provider"

interface VoteButtonProps {
  ideaId: string
}

export function VoteButton({ ideaId }: VoteButtonProps) {
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [upvotes, setUpvotes] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    async function loadVoteData() {
      const count = await getVoteCount(ideaId)
      setUpvotes(count)

      if (user) {
        const hasVoted = await checkUserVote(ideaId)
        setIsUpvoted(hasVoted)
      }
    }

    loadVoteData()
  }, [ideaId, user])

  const handleUpvote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upvote ideas",
      })
      router.push("/login")
      return
    }

    setIsLoading(true)
    const result = await toggleVote(ideaId)
    setIsLoading(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    if (result.action === "added") {
      setIsUpvoted(true)
      setUpvotes(upvotes + 1)
    } else {
      setIsUpvoted(false)
      setUpvotes(upvotes - 1)
    }
  }

  return (
    <Button
      variant={isUpvoted ? "default" : "outline"}
      onClick={handleUpvote}
      disabled={isLoading}
      className="w-full sm:w-auto"
    >
      <ThumbsUp className="mr-2 h-4 w-4" />
      Upvote ({upvotes})
    </Button>
  )
}
