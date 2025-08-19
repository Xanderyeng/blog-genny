import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Lock, ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import { GenerateForm } from '@/components/generate-article-form'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Generate Blog Post | Blog Genny",
  description:
    "Create SEO-optimized blog posts with AI. Enter a topic and get professional, well-structured content in minutes.",
}

export default async function GeneratePage() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-4xl font-bold tracking-tight">Generate Blog Post</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Enter a topic and let AI create a detailed, SEO-friendly blog post for you.
            </p>
          </div>

          {session?.user ? (
            <GenerateForm />
          ) : (
            <Card className="border-2 border-dashed border-muted-foreground/20">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Lock className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">Authentication Required</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground">
                  You need to be signed in to generate blog posts. Create an account or sign in to access our AI-powered content generation tools.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href="/auth/signin">
                      Sign In
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/auth/signup">
                      Create Account
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    What you get with an account:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
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
