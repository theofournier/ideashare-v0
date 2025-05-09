import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserX } from "lucide-react"

export default function ProfileNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <div className="mb-6">
        <UserX className="w-24 h-24 mx-auto text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">Profile Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
        The user profile you're looking for doesn't exist or may have been removed.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/browse">Browse Ideas</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
