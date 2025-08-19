import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/articles";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArticleContentSection } from "@/components/article-content";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): string {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
}

// Generate static params for all blog posts
export async function generateStaticParams() {
    const { articles } = await getArticles({ status: 'published' });
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article || article.status !== 'published') {
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

                        {/* Hero Image */}
                        {(article.coverImageUrl) && (
                            <div className="mb-8">
                                <img
                                    src={article.coverImageUrl}
                                    alt={`Hero image for ${article.title}`}
                                    className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                                />
                                {article.coverImageAttribution && (
                                    <div
                                        className="mt-2 text-xs text-muted-foreground"
                                        dangerouslySetInnerHTML={{
                                            __html: article.coverImageAttribution || ""
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <time dateTime={article.publishedAt?.toISOString() || article.createdAt.toISOString()}>
                                        {formatDate(article.publishedAt?.toISOString() || article.createdAt.toISOString())}
                                    </time>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{calculateReadingTime(article.content || '')}</span>
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>

                            {(article.description || article.metaDescription) && (
                                <p className="text-xl text-muted-foreground">
                                    {article.description || article.metaDescription}
                                </p>
                            )}
                        </div>
                    </div>

                    <ArticleContentSection content={article.content || ''} />
                </div>
            </main>
            <Footer />
        </>
    );
}