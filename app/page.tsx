import { getAllPosts } from "@/lib/mdx"
import { BlogCard } from "@/components/blog-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function HomePage() {
  const posts = await getAllPosts()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to Blog Genny</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              AI-powered blog generation with clean, intuitive design. Discover insights, tutorials, and thoughts on
              modern web development.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
            {posts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts yet. Start creating your first blog post!</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
