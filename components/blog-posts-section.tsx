import { Suspense } from "react"
import { getArticles } from "@/lib/articles"
import { BlogCard } from "@/components/blog-card"
import { BlogCardGridSkeleton } from "@/components/blog-card-skeleton"

// Helper function to calculate reading time
function calculateReadingTime(content: string): string {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
}

async function BlogPostsGrid() {
    const { articles } = await getArticles({
        status: 'published',
        limit: 20
    })

    // Transform database articles to BlogPost format
    const posts = articles.map(article => ({
        slug: article.slug,
        title: article.title,
        description: article.description || article.metaDescription || '',
        date: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
        tags: [], // We'll implement tags later
        readingTime: calculateReadingTime(article.content || ''),
        coverImageUrl: article.coverImageUrl || undefined,
        coverImageAttribution: article.coverImageAttribution || undefined,
        heroImage: article.coverImageUrl || undefined,
        heroImageAttribution: article.coverImageAttribution || undefined,
    }))

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No posts yet. Start creating your first blog post!</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
            ))}
        </div>
    )
}

export function BlogPostsSection() {
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
            <Suspense fallback={<BlogCardGridSkeleton count={6} />}>
                <BlogPostsGrid />
            </Suspense>
        </section>
    )
}
