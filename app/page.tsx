import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogPostsSection } from "@/components/blog-posts-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PenTool, ArrowRight, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to Blog Genny</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              AI-powered blog generation with clean, intuitive design. Discover insights, tutorials, and thoughts on
              modern web development.
            </p>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 mb-8 border">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">Want to create your own article?</span>
                </div>
                <p className="text-muted-foreground text-center max-w-md">
                  Generate AI-powered blog posts on any topic. Sign in to access our powerful content generation tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg">
                    <Link href="/auth/signin">
                      <PenTool className="h-4 w-4 mr-2" />
                      Sign In to Generate
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/auth/signup">
                      Create Account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Already have an account? The generate button in the navigation will redirect you to sign in.
                </p>
              </div>
            </div>
          </section>

          <BlogPostsSection />
        </div>
      </main>
      <Footer />
    </>
  )
}
