import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  readingTime: string
  coverImageUrl?: string
  coverImageAttribution?: string
  heroImage?: string
  heroImageAttribution?: string
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow pt-0 overflow-hidden">
      {/* Cover Image */}
      {post.coverImageUrl && (
        <div className="w-full !pt-0 !mt-0 overflow-hidden">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full aspect-video object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <Clock className="h-4 w-4 ml-2" />
          <span>{post.readingTime}</span>
        </div>
        <CardTitle className="line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">{post.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
