import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

// Assuming you have a file that exports this function
import { formatDate } from "@/lib/utils"

// The type definition should match your 'articles' schema
interface ArticleCardProps {
  article: {
    id: string
    title: string
    description: string | null
    createdAt: Date
    slug: string // ✅ Add the slug property
    tags: string[] | null
    coverImageUrl?: string | null // ✅ Make coverImageUrl accept null
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="hover:shadow-lg pt-0 h-full overflow-hidden transition-shadow">
      {/* Cover Image */}
      {article.coverImageUrl && (
        <div className="!mt-0 !pt-0 w-full overflow-hidden">
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full object-cover aspect-video hover:scale-105 transition-transform"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
          <Calendar className="w-4 h-4" />
          <time dateTime={article.createdAt.toISOString()}>{formatDate(article.createdAt.toISOString())}</time>
        </div>
        <CardTitle className="line-clamp-2">
          {/* Link to the specific article page using its ID */}
          <Link href={`/dashboard/articles/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">{article.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {article.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
