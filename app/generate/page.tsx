import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Lock, ArrowRight, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import { GenerateForm } from '@/components/generate-article-form'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export const metadata: Metadata = {
  title: "New Article | Blog Genny",
  description:
    "Generate a new AI-powered blog post from your dashboard.",
}

export default async function NewArticlePage() {
  const session = await getServerSession(authOptions)
  
  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="mx-auto px-4 py-8 max-w-2xl container">
          <div className="flex justify-between items-center mb-8">
            {/* Added a back button for better navigation */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/articles">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Link>
            </Button>
            <div className="flex-1 text-center">
                <div className="flex justify-center items-center mb-4">
                    <Sparkles className="mr-3 w-8 h-8 text-primary" />
                    <h1 className="font-bold text-4xl tracking-tight">Generate Blog Post</h1>
                </div>
                <p className="text-muted-foreground text-xl">
                    Enter a topic and let AI create a detailed, SEO-friendly blog post for you.
                </p>
            </div>
            {/* spacer */}
            <div/>
          </div>

          {session?.user ? (
            <GenerateForm />
          ) : (
            <Card className="border-2 border-muted-foreground/20 border-dashed">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Lock className="w-12 h-12 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">Authentication Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground">
                  You need to be signed in to generate blog posts. Create an account or sign in to access our AI-powered content generation tools.
                </p>
                <div className="flex sm:flex-row flex-col justify-center gap-3">
                  <Button asChild size="lg">
                    <Link href="/auth/signin">
                      Sign In
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/auth/signup">
                      Create Account
                    </Link>
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <p className="mb-3 text-muted-foreground text-sm">
                    What you get with an account:
                  </p>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Generate unlimited AI blog posts</li>
                    <li>• Save and manage your content</li>
                    <li>• Access to premium features</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}