import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { CodeBlock } from "./code-block"

interface ArticleLayoutProps {
  children?: ReactNode
  content?: string
  title?: string
  publishedAt?: string
  author?: string
  tags?: string[]
  coverImageUrl?: string
  coverImageAttribution?: string
}

export function ArticleLayout({
  children,
  content,
  title,
  publishedAt,
  author,
  tags,
  coverImageUrl,
  coverImageAttribution,
}: ArticleLayoutProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString // fallback to original string if parsing fails
    }
  }

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
            <h1 className="text-4xl font-bold mb-4 text-foreground">{title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              {author && <span>By {author}</span>}
              {publishedAt && <span>•</span>}
              {publishedAt && <time>{formatDate(publishedAt)}</time>}
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
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-blockquote:border-l-primary">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-medium mt-4 mb-2 text-foreground">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-foreground">{children}</li>,
                code: ({ inline, children, className, ...props }: any) => {
                  if (inline) {
                    return (
                      <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">{children}</code>
                    )
                  }

                  // Extract language from className (format: language-xxx)
                  const language = className?.replace("language-", "") || ""
                  const codeString = String(children).replace(/\n$/, "")

                  return <CodeBlock language={language}>{codeString}</CodeBlock>
                },
                pre: ({ children }) => {
                  return <>{children}</>
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            children
          )}
        </div>
      </div>
    </article>
  )
}
