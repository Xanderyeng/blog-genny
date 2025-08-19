import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

import { Sparkles } from "lucide-react"
import type { Metadata } from "next"
import { GenerateForm } from '@/components/generate-article-form'

export const metadata: Metadata = {
  title: "Generate Blog Post | Blog Genny",
  description:
    "Create SEO-optimized blog posts with AI. Enter a topic and get professional, well-structured content in minutes.",
}

export default function GeneratePage() {
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

          <GenerateForm />

          <div className="mt-8 p-4 rounded-lg bg-muted/50 glass-light">
            <h3 className="font-semibold mb-2">✨ What you'll get:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• SEO-optimized content (600-800 words)</li>
              <li>• Clear headings and structure</li>
              <li>• Relevant examples and insights</li>
              <li>• Professional formatting</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
