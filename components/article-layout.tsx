import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { CodeBlock } from "./code-block"
import type { Components } from "react-markdown"

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
    <article className="mx-auto rounded-lg max-w-4xl overflow-hidden glass">
      {coverImageUrl && (
        <div className="relative">
          <img
            src={coverImageUrl || "/placeholder.svg"}
            alt={title || "Article hero image"}
            className="w-full h-64 md:h-80 object-cover"
          />
          {coverImageAttribution && (
            <div
              className="right-2 bottom-2 absolute bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs"
              dangerouslySetInnerHTML={{ __html: coverImageAttribution }}
            />
          )}
        </div>
      )}

      <div className="p-8">
        {title && (
          <header className="mb-8 pb-6 border-b border-border/20">
            <h1 className="mb-4 font-bold text-foreground text-4xl">{title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              {author && <span>By {author}</span>}
              {publishedAt && <span>•</span>}
              {publishedAt && <time>{formatDate(publishedAt)}</time>}
            </div>
            {tags && tags.length > 0 && (
              <div className="flex gap-2 mt-4">
                {tags.map((tag) => (
                  <span key={tag} className="bg-primary/10 px-2 py-1 rounded-md text-primary text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
        )}
        <div className="prose-pre:bg-muted dark:prose-invert prose-pre:border prose-blockquote:border-l-primary max-w-none prose-code:text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose prose-lg">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => <h1 className="mt-8 mb-4 font-bold text-foreground text-3xl">{children}</h1>,
                h2: ({ children }) => <h2 className="mt-6 mb-3 font-semibold text-foreground text-2xl">{children}</h2>,
                h3: ({ children }) => <h3 className="mt-4 mb-2 font-medium text-foreground text-xl">{children}</h3>,
                p: ({ children }) => <p className="mb-4 text-foreground leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="space-y-2 mb-4 list-disc list-inside">{children}</ul>,
                ol: ({ children }) => <ol className="space-y-2 mb-4 list-decimal list-inside">{children}</ol>,
                li: ({ children }) => <li className="text-foreground">{children}</li>,
                code: (({ node, children, className }) => {
                  // @ts-expect-error: 'node' is a hast element, and 'inline' is a property on it
                  const isInline = node?.inline
                  if (isInline) {
                    return (
                      <code className="bg-muted px-1 py-0.5 rounded font-mono text-foreground text-sm">{children}</code>
                    )
                  }

                  // Extract language from className (format: language-xxx)
                  const language = className?.replace("language-", "") || ""
                  const codeString = String(children).replace(/\n$/, "")

                  return <CodeBlock language={language}>{codeString}</CodeBlock>
                }) as Components["code"],
                pre: ({ children }) => {
                  return <>{children}</>
                },
                blockquote: ({ children }) => (
                  <blockquote className="my-4 pl-4 border-primary border-l-4 text-muted-foreground italic">
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
