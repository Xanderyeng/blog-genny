"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, Loader2, Sparkles } from "lucide-react"
import { generateBlog } from "@/app/actions/generateBlog"

export function GenerateForm() {
  const [topic, setTopic] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

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

      if (result.success) {
        // Redirect to the newly created blog post
        router.push(`/blog/${result.slug}`)
      } else {
        setError(result.error || "Failed to generate blog post. Please try again.")
      }
    } catch (error) {
      console.error("Error generating blog:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          Blog Post Details
        </CardTitle>
        <CardDescription>Provide a topic and any specific instructions for your blog post.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="topic" className="text-sm font-medium">
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
            <p className="text-xs text-muted-foreground">What would you like to write about?</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="customPrompt" className="text-sm font-medium">
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
            <p className="text-xs text-muted-foreground">
              Any specific requirements or style preferences for your blog post.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={isGenerating || !topic.trim()} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating your blog post...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Blog Post
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
