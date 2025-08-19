import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogPostsSection } from "@/components/blog-posts-section"
import { Button } from "@/components/ui/button"
import { UserDashboard } from "@/components/user-dashboard"
import Link from "next/link"
import { PenTool, ArrowRight, Sparkles } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  let userDetails = null
  if (session?.user?.email) {
    const userQuery = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)
    
    userDetails = userQuery[0] || null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {session ? `Welcome back, ${session.user?.name || 'User'}!` : 'Welcome to Blog Genny'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {session 
                ? 'Ready to create amazing content? Access your dashboard and start generating AI-powered articles.'
                : 'AI-powered blog generation with clean, intuitive design. Discover insights, tutorials, and thoughts on modern web development.'
              }
            </p>

            {/* CTA Section - Only show for non-authenticated users */}
            {!session && (
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
            )}

            {/* User Dashboard - Show for authenticated users */}
            {session && userDetails && (
              <UserDashboard user={userDetails} />
            )}
          </section>

          <BlogPostsSection />
        </div>
      </main>
      <Footer />
    </>
  )
}
