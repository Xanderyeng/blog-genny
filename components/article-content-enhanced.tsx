import { Suspense } from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Skeleton } from "@/components/ui/skeleton"

interface ArticleContentProps {
    content: string
}

function ArticleContentSkeleton() {
    return (
        <article className="prose prose-lg max-w-none">
            <div className="space-y-6">
                {/* Paragraph skeletons */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        {i % 4 === 3 && <Skeleton className="h-8 w-1/2 mt-6" />}
                    </div>
                ))}
            </div>
        </article>
    )
}

const mdxComponents = {
    h1: ({ children }: any) => (
        <h1 className="text-3xl font-bold mt-8 mb-6 text-foreground border-b border-border pb-2">
            {children}
        </h1>
    ),
    h2: ({ children }: any) => (
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">
            {children}
        </h2>
    ),
    h3: ({ children }: any) => (
        <h3 className="text-xl font-medium mt-6 mb-3 text-foreground">
            {children}
        </h3>
    ),
    h4: ({ children }: any) => (
        <h4 className="text-lg font-medium mt-4 mb-2 text-foreground">
            {children}
        </h4>
    ),
    p: ({ children }: any) => (
        <p className="mb-4 leading-relaxed text-foreground">
            {children}
        </p>
    ),
    pre: ({ children }: any) => (
        <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto mb-6 border border-border">
            {children}
        </pre>
    ),
    code: ({ children, className }: any) => {
        const isInline = !className
        if (isInline) {
            return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground border">
                    {children}
                </code>
            )
        }
        return (
            <code className={`text-sm font-mono text-foreground ${className || ''}`}>
                {children}
            </code>
        )
    },
    ul: ({ children }: any) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-foreground">
            {children}
        </ul>
    ),
    ol: ({ children }: any) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground">
            {children}
        </ol>
    ),
    li: ({ children }: any) => (
        <li className="text-foreground ml-2">
            {children}
        </li>
    ),
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground bg-muted/30 py-2">
            {children}
        </blockquote>
    ),
    a: ({ children, href }: any) => (
        <a
            href={href}
            className="text-primary hover:text-primary/80 underline underline-offset-2"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    ),
    img: ({ src, alt }: any) => (
        <img
            src={src}
            alt={alt}
            className="rounded-lg shadow-md my-6 max-w-full h-auto"
        />
    ),
    table: ({ children }: any) => (
        <div className="overflow-x-auto my-6">
            <table className="min-w-full border border-border rounded-lg">
                {children}
            </table>
        </div>
    ),
    th: ({ children }: any) => (
        <th className="bg-muted px-4 py-2 text-left font-medium text-foreground border-b border-border">
            {children}
        </th>
    ),
    td: ({ children }: any) => (
        <td className="px-4 py-2 text-foreground border-b border-border/50">
            {children}
        </td>
    ),
}

async function ArticleContent({ content }: ArticleContentProps) {
    return (
        <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground">
            <MDXRemote
                source={content}
                components={mdxComponents}
            />
        </article>
    )
}

export function ArticleContentSection({ content }: ArticleContentProps) {
    return (
        <Suspense fallback={<ArticleContentSkeleton />}>
            <ArticleContent content={content} />
        </Suspense>
    )
}
