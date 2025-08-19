import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="mb-8">
                        <Button variant="ghost" asChild className="mb-6">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{post.readingTime}</span>
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

                            {post.description && (
                                <p className="text-xl text-muted-foreground">{post.description}</p>
                            )}

                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <div
                            className="space-y-4"
                            dangerouslySetInnerHTML={{ __html: formatMarkdownContent(post.content) }}
                        />
                    </article>
                </div>
            </main>
            <Footer />
        </>
    );
}

// Simple markdown to HTML converter for basic formatting
function formatMarkdownContent(content: string): string {
    // First, handle list items by collecting them into groups
    let formattedContent = content
        // Convert headers
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-6">$1</h1>')
        // Convert bold text
        .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
        // Convert italic text
        .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
        // Convert bullet points to list items
        .replace(/^\* (.*)$/gim, '<li class="ml-4 list-disc">$1</li>')
        .replace(/^- (.*)$/gim, '<li class="ml-4 list-disc">$1</li>');

    // Wrap consecutive list items in ul tags
    formattedContent = formattedContent.replace(
        /(<li[^>]*>.*?<\/li>\s*)+/gim,
        '<ul class="space-y-2 my-4">$&</ul>'
    );

    // Convert double line breaks to paragraph breaks
    formattedContent = formattedContent
        .split('\n\n')
        .map((paragraph) => {
            paragraph = paragraph.trim();
            if (!paragraph) return '';

            // Don't wrap headers, lists, or empty content in paragraphs
            if (paragraph.match(/^<(h[1-6]|ul|li)/)) {
                return paragraph;
            }

            return `<p class="mb-4 leading-relaxed">${paragraph}</p>`;
        })
        .join('\n');

    return formattedContent;
}
