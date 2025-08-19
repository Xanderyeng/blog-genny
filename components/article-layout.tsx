import type { ReactNode } from "react"

interface ArticleLayoutProps {
  children: ReactNode
  title?: string
  publishedAt?: string
  author?: string
  tags?: string[]
  coverImageUrl?: string
  coverImageAttribution?: string
}

export function ArticleLayout({
  children,
  title,
  publishedAt,
  author,
  tags,
  coverImageUrl,
  coverImageAttribution,
}: ArticleLayoutProps) {
  return (
    <article className="glass rounded-lg overflow-hidden max-w-4xl mx-auto">
      {coverImageUrl && (
        <div className="relative">
          <img
            src={coverImageUrl || "/placeholder.svg"}
            alt={title || "Article hero image"}
            className="w-full h-64 md:h-80 object-cover"
          />
          {coverImageAttribution && (
            <div
              className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm"
              dangerouslySetInnerHTML={{ __html: coverImageAttribution }}
            />
          )}
        </div>
      )}

      <div className="p-8">
        {title && (
          <header className="mb-8 border-b border-border/20 pb-6">
            <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              {author && <span>By {author}</span>}
              {publishedAt && <span>•</span>}
              {publishedAt && <time>{publishedAt}</time>}
            </div>
            {tags && tags.length > 0 && (
              <div className="flex gap-2 mt-4">
                {tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
        )}
        <div className="prose prose-lg dark:prose-invert max-w-none">{children}</div>
      </div>
    </article>
  )
}
