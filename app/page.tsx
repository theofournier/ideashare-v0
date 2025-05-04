import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Lightbulb, Users, Zap, ThumbsUp } from "lucide-react"
import { ideas, tags } from "@/lib/mock-data"

export default function LandingPage() {
  // Get trending ideas (most upvoted)
  const trendingIdeas = [...ideas].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3)

  // Get popular tags
  const popularTags = [...tags].slice(0, 6)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-background/80 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Discover and Share Tech Project Ideas
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Find inspiration for your next project, share your ideas with the community, and collaborate with
                  other developers.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/browse">
                  <Button size="lg" className="gap-1">
                    Browse Ideas
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/submit">
                  <Button size="lg" variant="outline">
                    Submit Your Idea
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                <Image src="/placeholder.svg?key=o5bep" alt="Developers sharing ideas" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Trending Ideas</h2>
            <Link href="/browse">
              <Button variant="ghost" className="gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingIdeas.map((idea) => (
              <Link key={idea.id} href={`/idea/${idea.id}`} className="group">
                <div className="rounded-lg border bg-card p-4 transition-all hover:shadow-md">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline">{idea.difficulty}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{idea.upvotes}</span>
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold group-hover:text-primary">{idea.title}</h3>
                  <p className="text-sm text-muted-foreground">{idea.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tags Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 text-3xl font-bold">Popular Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {popularTags.map((tag) => (
              <Link key={tag.id} href={`/browse?tag=${tag.id}`}>
                <div className={`${tag.color} h-full rounded-lg p-6 text-white transition-transform hover:scale-105`}>
                  <h3 className="text-xl font-bold">{tag.name}</h3>
                  <p className="mt-2 text-sm text-white/80">
                    {ideas.filter((idea) => idea.tags.includes(tag.id)).length} ideas
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Discover Ideas</h3>
              <p className="text-muted-foreground">
                Browse through a curated collection of tech project ideas across various categories and difficulty
                levels.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Share Your Ideas</h3>
              <p className="text-muted-foreground">
                Submit your own project ideas to inspire others and get feedback from the community.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Collaborate</h3>
              <p className="text-muted-foreground">
                Connect with other developers, upvote ideas you like, and collaborate on projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mb-8 max-w-[600px] text-primary-foreground/80">
              Join our community of developers and start discovering or sharing tech project ideas today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Sign Up
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Browse Ideas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
