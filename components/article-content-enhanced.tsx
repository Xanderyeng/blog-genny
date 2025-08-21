import { Suspense } from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Skeleton } from "@/components/ui/skeleton"

// Define a generic interface for MDX component props
interface MDXComponentProps {
    children?: React.ReactNode;
    // Allow any other props, such as 'id' or 'className', but be specific where possible.
    [key: string]: unknown;
}

interface HeadingProps extends MDXComponentProps {
    id?: string; // Headings often have an ID
}

interface CodeProps extends MDXComponentProps {
    className?: string; // For syntax highlighting language
}

interface AnchorProps extends MDXComponentProps {
    href?: string;
    target?: string;
    rel?: string;
}

interface ImgProps extends MDXComponentProps {
    src?: string;
    alt?: string;
    title?: string; // Common img attribute
}

function ArticleContentSkeleton() {
    return (
        <article className="max-w-none prose prose-lg">
            <div className="space-y-6">
                {/* Paragraph skeletons */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-3/4 h-4" />
                        {i % 4 === 3 && <Skeleton className="mt-6 w-1/2 h-8" />}
                    </div>
                ))}
            </div>
        </article>
    )
}

const mdxComponents = {
    h1: ({ children, ...props }: HeadingProps) => (
        <h1 className="mt-8 mb-6 pb-2 border-b border-border font-bold text-foreground text-3xl" {...props}>
            {children}
        </h1>
    ),
    h2: ({ children, ...props }: HeadingProps) => (
        <h2 className="mt-8 mb-4 font-semibold text-foreground text-2xl" {...props}>
            {children}
        </h2>
    ),
    h3: ({ children, ...props }: HeadingProps) => (
        <h3 className="mt-6 mb-3 font-medium text-foreground text-xl" {...props}>
            {children}
        </h3>
    ),
    h4: ({ children, ...props }: HeadingProps) => (
        <h4 className="mt-4 mb-2 font-medium text-foreground text-lg" {...props}>
            {children}
        </h4>
    ),
    p: ({ children, ...props }: MDXComponentProps) => (
        <p className="mb-4 text-foreground leading-relaxed" {...props}>
            {children}
        </p>
    ),
    pre: ({ children, ...props }: MDXComponentProps) => (
        <pre className="bg-muted/50 mb-6 p-4 border border-border rounded-lg overflow-x-auto" {...props}>
            {children}
        </pre>
    ),
    code: ({ children, className, ...props }: CodeProps) => {
        const isInline = !className
        if (isInline) {
            return (
                <code className="bg-muted px-1.5 py-0.5 border rounded font-mono text-foreground text-sm" {...props}>
                    {children}
                </code>
            )
        }
        return (
            <code className={`text-sm font-mono text-foreground ${className || ''}`} {...props}>
                {children}
            </code>
        )
    },
    ul: ({ children, ...props }: MDXComponentProps) => (
        <ul className="space-y-2 mb-4 text-foreground list-disc list-inside" {...props}>
            {children}
        </ul>
    ),
    ol: ({ children, ...props }: MDXComponentProps) => (
        <ol className="space-y-2 mb-4 text-foreground list-decimal list-inside" {...props}>
            {children}
        </ol>
    ),
    li: ({ children, ...props }: MDXComponentProps) => (
        <li className="ml-2 text-foreground" {...props}>
            {children}
        </li>
    ),
    blockquote: ({ children, ...props }: MDXComponentProps) => (
        <blockquote className="bg-muted/30 my-6 py-2 pl-4 border-primary border-l-4 text-muted-foreground italic" {...props}>
            {children}
        </blockquote>
    ),
    a: ({ children, href, ...props }: AnchorProps) => (
        <a
            href={href}
            className="text-primary hover:text-primary/80 underline underline-offset-2"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
        >
            {children}
        </a>
    ),
    img: ({ src, alt, ...props }: ImgProps) => (
        <img
            src={src}
            alt={alt}
            className="shadow-md my-6 rounded-lg max-w-full h-auto"
            {...props}
        />
    ),
    table: ({ children, ...props }: MDXComponentProps) => (
        <div className="my-6 overflow-x-auto">
            <table className="border border-border rounded-lg min-w-full" {...props}>
                {children}
            </table>
        </div>
    ),
    th: ({ children, ...props }: MDXComponentProps) => (
        <th className="bg-muted px-4 py-2 border-b border-border font-medium text-foreground text-left" {...props}>
            {children}
        </th>
    ),
    td: ({ children, ...props }: MDXComponentProps) => (
        <td className="px-4 py-2 border-b border-border/50 text-foreground" {...props}>
            {children}
        </td>
    ),
}

interface ArticleContentProps {
    content: string
}

async function ArticleContent({ content }: ArticleContentProps) {
    return (
        <article className="max-w-none prose-code:text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose prose-lg">
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