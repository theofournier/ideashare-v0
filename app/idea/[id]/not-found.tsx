import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function IdeaNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Idea Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The idea you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/browse">Browse Ideas</Link>
      </Button>
    </div>
  )
}
