import type { ReactNode } from "react"

interface ArticleLayoutProps {
  children: ReactNode
  title?: string
  publishedAt?: string
  author?: string
  tags?: string[]
}

export function ArticleLayout({ children, title, publishedAt, author, tags }: ArticleLayoutProps) {
  return (
    <article className="glass rounded-lg p-8 max-w-4xl mx-auto">
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
    </article>
  )
}
