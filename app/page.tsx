"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Lightbulb, Users, Zap, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ideas, tags, getTagById } from "@/lib/mock-data"

export default function LandingPage() {
  // Get trending ideas (most upvoted)
  const trendingIdeas = [...ideas].sort((a, b) => b.upvotes - a.upvotes).slice(0, 20)
  const [currentPage, setCurrentPage] = useState(0)

  // Number of cards to show per page based on screen size
  const cardsPerPage = 4
  const totalPages = Math.ceil(trendingIdeas.length / cardsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  // Get current page of ideas
  const currentIdeas = trendingIdeas.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)

  // Get popular tags
  const popularTags = [...tags].slice(0, 6)

  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Set first category as default on initial render
  useEffect(() => {
    if (popularTags.length > 0 && !selectedCategory) {
      setSelectedCategory(popularTags[0].id)
    }
  }, [popularTags, selectedCategory])

  // Get ideas for selected category
  const categoryIdeas = selectedCategory
    ? [...ideas]
        .filter((idea) => idea.tags.includes(selectedCategory))
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 20)
    : []

  // Category carousel state
  const [categoryPage, setCategoryPage] = useState(0)
  const categoryTotalPages = Math.ceil(categoryIdeas.length / cardsPerPage)

  const nextCategoryPage = () => {
    setCategoryPage((prev) => (prev + 1) % categoryTotalPages)
  }

  const prevCategoryPage = () => {
    setCategoryPage((prev) => (prev - 1 + categoryTotalPages) % categoryTotalPages)
  }

  // Get current page of category ideas
  const currentCategoryIdeas = categoryIdeas.slice(categoryPage * cardsPerPage, (categoryPage + 1) * cardsPerPage)

  // Get selected category name
  const selectedCategoryName = selectedCategory ? popularTags.find((tag) => tag.id === selectedCategory)?.name : ""

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
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Trending Ideas</h2>
            <Link href="/browse">
              <Button variant="ghost" className="gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentIdeas.map((idea) => (
                <Card
                  key={idea.id}
                  className="h-full overflow-hidden transition-all hover:shadow-md card-enhanced flex flex-col relative"
                >
                  {idea.image ? (
                    <CardHeader className="p-2 pb-0">
                      <div className="relative h-24 w-full overflow-hidden rounded-md">
                        <Image src={idea.image || "/placeholder.svg"} alt={idea.title} fill className="object-cover" />
                      </div>
                    </CardHeader>
                  ) : (
                    <CardHeader className="p-2 pb-0">
                      <div className="flex h-24 w-full items-center justify-center rounded-md bg-muted">
                        <Lightbulb className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    </CardHeader>
                  )}
                  <CardContent className="p-2 flex-grow">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {idea.tags.slice(0, 1).map((tagId) => {
                          const tag = getTagById(tagId)
                          return tag ? (
                            <Badge key={tag.id} className={`${tag.color} text-white text-[10px] px-1.5 py-0`}>
                              {tag.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {idea.difficulty}
                      </Badge>
                    </div>
                    <Link href={`/idea/${idea.id}`}>
                      <h3 className="mb-1 text-sm font-bold line-clamp-2 hover:text-primary">{idea.title}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2">{idea.shortDescription}</p>

                    {/* Tech Stack - simplified */}
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-1">
                        {idea.techStack.slice(0, 2).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-medium text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                        {idea.techStack.length > 2 && (
                          <span className="inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-medium text-muted-foreground">
                            +{idea.techStack.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 pt-0">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ThumbsUp className="h-2.5 w-2.5" />
                        <span>{idea.upvotes}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={prevPage}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`h-2 w-2 rounded-full ${i === currentPage ? "bg-primary" : "bg-muted-foreground/30"}`}
                    onClick={() => setCurrentPage(i)}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={nextPage}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 text-3xl font-bold">Popular Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {popularTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedCategory(tag.id)}
                className={`${tag.color} h-full rounded-lg p-6 text-white transition-transform hover:scale-105 text-left ${
                  selectedCategory === tag.id ? "ring-4 ring-offset-2 ring-offset-background ring-primary" : ""
                }`}
              >
                <h3 className="text-xl font-bold">{tag.name}</h3>
                <p className="mt-2 text-sm text-white/80">
                  {ideas.filter((idea) => idea.tags.includes(tag.id)).length} ideas
                </p>
              </button>
            ))}
          </div>

          {/* Category Ideas */}
          {selectedCategory && currentCategoryIdeas.length > 0 && (
            <div className="mt-12">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold">{selectedCategoryName} Ideas</h3>
                <Link href={`/browse?tag=${selectedCategory}`}>
                  <Button variant="ghost" className="gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentCategoryIdeas.map((idea) => (
                    <Card
                      key={idea.id}
                      className="h-full overflow-hidden transition-all hover:shadow-md card-enhanced flex flex-col relative"
                    >
                      {idea.image ? (
                        <CardHeader className="p-2 pb-0">
                          <div className="relative h-24 w-full overflow-hidden rounded-md">
                            <Image
                              src={idea.image || "/placeholder.svg"}
                              alt={idea.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </CardHeader>
                      ) : (
                        <CardHeader className="p-2 pb-0">
                          <div className="flex h-24 w-full items-center justify-center rounded-md bg-muted">
                            <Lightbulb className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                        </CardHeader>
                      )}
                      <CardContent className="p-2 flex-grow">
                        <div className="mb-1 flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {idea.difficulty}
                          </Badge>
                        </div>
                        <Link href={`/idea/${idea.id}`}>
                          <h3 className="mb-1 text-sm font-bold line-clamp-2 hover:text-primary">{idea.title}</h3>
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-2">{idea.shortDescription}</p>

                        {/* Tech Stack - simplified */}
                        <div className="mt-1">
                          <div className="flex flex-wrap gap-1">
                            {idea.techStack.slice(0, 2).map((tech) => (
                              <span
                                key={tech}
                                className="inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-medium text-muted-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                            {idea.techStack.length > 2 && (
                              <span className="inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-medium text-muted-foreground">
                                +{idea.techStack.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-2 pt-0">
                        <div className="flex w-full items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <ThumbsUp className="h-2.5 w-2.5" />
                            <span>{idea.upvotes}</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Category Carousel Controls */}
                {categoryTotalPages > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={prevCategoryPage}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: categoryTotalPages }).map((_, i) => (
                        <button
                          key={i}
                          className={`h-2 w-2 rounded-full ${i === categoryPage ? "bg-primary" : "bg-muted-foreground/30"}`}
                          onClick={() => setCategoryPage(i)}
                          aria-label={`Go to page ${i + 1}`}
                        />
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={nextCategoryPage}
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
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
