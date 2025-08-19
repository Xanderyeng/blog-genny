"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface GenerateArticleFormProps {
  onSubmit?: (prompt: string) => Promise<void>
}

export function GenerateArticleForm({ onSubmit }: GenerateArticleFormProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    try {
      await onSubmit?.(prompt)
      setPrompt("") // Clear form on success
    } catch (error) {
      console.error("Failed to generate article:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="glass max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate New Article</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Article Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the article you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          <Button type="submit" disabled={!prompt.trim() || isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Article"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
