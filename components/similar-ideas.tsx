import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"
import { type Idea, getTagsForIdea } from "@/lib/mock-data"

interface SimilarIdeasProps {
  currentIdeaId: string
  similarIdeas: Idea[]
}

export function SimilarIdeas({ currentIdeaId, similarIdeas }: SimilarIdeasProps) {
  if (similarIdeas.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-medium">Similar Ideas</h3>
      <div className="max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
        {similarIdeas.map((idea) => {
          const tags = getTagsForIdea(idea)
          return (
            <Link href={`/idea/${idea.id}`} key={idea.id} className="block mb-5 last:mb-0">
              <Card className="overflow-hidden transition-all hover:bg-muted/50 card-enhanced">
                <CardContent className="flex p-3">
                  <div className="relative mr-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {idea.image ? (
                      <Image src={idea.image || "/placeholder.svg"} alt={idea.title} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Lightbulb className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 font-medium">{idea.title}</h4>
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.id} className={`${tag.color} text-white`} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                      {tags.length > 2 && <Badge variant="outline">+{tags.length - 2}</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
