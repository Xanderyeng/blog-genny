import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"

export interface BlogPost {
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
    <Card className="hover:shadow-lg pt-0 h-full overflow-hidden transition-shadow">
      {/* Cover Image */}
      {post.coverImageUrl && (
        <div className="!mt-0 !pt-0 w-full overflow-hidden">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full object-cover aspect-video hover:scale-105 transition-transform"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <Clock className="ml-2 w-4 h-4" />
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
