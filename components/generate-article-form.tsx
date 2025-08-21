"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, Loader2, Sparkles } from "lucide-react"
import { generateBlog } from "@/app/actions/generateBlog"
import { ArticleGenerationNotification } from "@/components/article-generation-notification"
import { toast } from "sonner"

export function GenerateForm() {
  const [topic, setTopic] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [generatedArticle, setGeneratedArticle] = useState<{
    id: string
    title: string
    slug: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!topic.trim()) {
      setError("Please enter a topic for your blog post.")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const fullPrompt = customPrompt ? `Topic: ${topic}\n\nAdditional instructions: ${customPrompt}` : topic

      const result = await generateBlog(fullPrompt)

      if (result.success && result.articleId && result.slug) {
        // Get the article title by fetching the article data
        const articleResponse = await fetch(`/api/articles/${result.articleId}`)
        const articleData = await articleResponse.json()
        
        // Show success toast
        toast.success("Article generated successfully!")
        
        // Show the notification modal
        setGeneratedArticle({
          id: result.articleId,
          title: articleData.title || topic,
          slug: result.slug
        })
        
        // Reset form
        setTopic("")
        setCustomPrompt("")
      } else {
        setError(result.error || "Failed to generate blog post. Please try again.")
        toast.error(result.error || "Failed to generate blog post")
      }
    } catch (error) {
      console.error("Error generating blog:", error)
      const errorMessage = "An unexpected error occurred. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Blog Post Details
          </CardTitle>
          <CardDescription>Provide a topic and any specific instructions for your blog post.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="topic" className="font-medium text-sm">
                Topic *
              </label>
              <Input
                id="topic"
                type="text"
                placeholder="e.g., 'The Future of Artificial Intelligence'"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isGenerating}
                className="w-full"
              />
              <p className="text-muted-foreground text-xs">What would you like to write about?</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="customPrompt" className="font-medium text-sm">
                Additional Instructions (Optional)
              </label>
              <Textarea
                id="customPrompt"
                placeholder="e.g., 'Focus on practical examples', 'Include code snippets', 'Target beginners'"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                disabled={isGenerating}
                className="w-full min-h-[100px]"
              />
              <p className="text-muted-foreground text-xs">
                Any specific requirements or style preferences for your blog post.
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 p-3 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isGenerating || !topic.trim()} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Generating your blog post...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-4 h-4" />
                  Generate Blog Post
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Article Generation Notification Modal */}
      {generatedArticle && (
        <ArticleGenerationNotification
          articleId={generatedArticle.id}
          title={generatedArticle.title}
          slug={generatedArticle.slug}
          onClose={() => setGeneratedArticle(null)}
        />
      )}
    </>
  )
}
