import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SimilarIdeasProps {
  currentIdeaId: string
  similarIdeas: any[]
}

export function SimilarIdeas({ currentIdeaId, similarIdeas }: SimilarIdeasProps) {
  if (similarIdeas.length === 0) {
    return null
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-medium">Similar Ideas</h3>
      <div className="max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
        {similarIdeas.map((idea) => (
          <Link href={`/idea/${idea.id}`} key={idea.id} className="block mb-5 last:mb-0">
            <Card className="overflow-hidden transition-all hover:bg-muted/50 card-enhanced">
              <CardContent className="p-3">
                <div className="flex-1">
                  <h4 className="mb-1 font-medium">{idea.title}</h4>
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.slice(0, 2).map((tag: any) => (
                      <Badge key={tag.id} className={`${tag.color} text-white`} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))}
                    {idea.tags.length > 2 && <Badge variant="outline">+{idea.tags.length - 2}</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
