import { Suspense } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Skeleton } from "@/components/ui/skeleton";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { sanitizeMDXContent } from "@/lib/mdx";

// 1. Correctly define component props interfaces/types
interface ArticleContentProps {
    content: string;
}

// MDX component prop types
type MDXComponentProps = {
    children?: React.ReactNode;
    [key: string]: unknown;
};

type HeadingProps = MDXComponentProps & { id?: string };
type ParagraphProps = MDXComponentProps;
type PreProps = MDXComponentProps;
type ListProps = MDXComponentProps;
type ListItemProps = MDXComponentProps;
type BlockquoteProps = MDXComponentProps;
type TableProps = MDXComponentProps;
type TableCellProps = MDXComponentProps;
type TableHeaderProps = MDXComponentProps;
type AnchorProps = MDXComponentProps & { href?: string; target?: string; rel?: string };
type ImgProps = MDXComponentProps & { src?: string; alt?: string; title?: string };
type CodeProps = MDXComponentProps & { className?: string };

// 2. Define the skeleton component
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
    );
}

// 3. Define the MDX components object
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
    p: ({ children, ...props }: ParagraphProps) => (
        <p className="mb-4 text-foreground leading-relaxed" {...props}>
            {children}
        </p>
    ),
    pre: ({ children, ...props }: PreProps) => <>{children}</>,
    code: ({ children, className, ...props }: CodeProps) => {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';
        if (!className) {
            return (
                <code className="bg-muted px-1.5 py-0.5 border rounded font-mono text-foreground text-sm" {...props}>
                    {children}
                </code>
            );
        }
        return (
            <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                className="my-4 rounded-lg"
                customStyle={{
                    padding: '1rem',
                    backgroundColor: 'hsl(var(--muted))',
                    border: '1px solid hsl(var(--border))',
                }}
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        );
    },
    ul: ({ children, ...props }: ListProps) => (
        <ul className="space-y-2 mb-4 text-foreground list-disc list-inside" {...props}>
            {children}
        </ul>
    ),
    ol: ({ children, ...props }: ListProps) => (
        <ol className="space-y-2 mb-4 text-foreground list-decimal list-inside" {...props}>
            {children}
        </ol>
    ),
    li: ({ children, ...props }: ListItemProps) => (
        <li className="ml-2 text-foreground" {...props}>
            {children}
        </li>
    ),
    blockquote: ({ children, ...props }: BlockquoteProps) => (
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
    table: ({ children, ...props }: TableProps) => (
        <div className="my-6 overflow-x-auto">
            <table className="border border-border rounded-lg min-w-full" {...props}>
                {children}
            </table>
        </div>
    ),
    th: ({ children, ...props }: TableHeaderProps) => (
        <th className="bg-muted px-4 py-2 border-b border-border font-medium text-foreground text-left" {...props}>
            {children}
        </th>
    ),
    td: ({ children, ...props }: TableCellProps) => (
        <td className="px-4 py-2 border-b border-border/50 text-foreground" {...props}>
            {children}
        </td>
    ),
};


async function ArticleContent({ content }: ArticleContentProps) {
    const sanitizedContent = sanitizeMDXContent(content);

    try {
        return (
            <article className="max-w-none prose-code:text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose prose-lg">
                <MDXRemote
                    source={sanitizedContent}
                    components={mdxComponents}
                />
            </article>
        );
    } catch (error) {
        console.error("Error rendering MDX content:", error);
        return (
            <div className="text-red-500">
                <p>Error loading article content. Please try again later.</p>
                <p>Details: {error instanceof Error ? error.message : String(error)}</p>
            </div>
        );
    }
}

export function ArticleContentSection({ content }: ArticleContentProps) {
    return (
        <Suspense fallback={<ArticleContentSkeleton />}>
            <ArticleContent content={content} />
        </Suspense>
    );
}