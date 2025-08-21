"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, Globe, X } from "lucide-react"
import { toast } from "sonner"

interface ArticleGenerationNotificationProps {
  articleId: string
  title: string
  slug: string
  onClose: () => void
}

export function ArticleGenerationNotification({
  articleId,
  title,
  slug,
  onClose
}: ArticleGenerationNotificationProps) {
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds
  const [isAutoPublishing, setIsAutoPublishing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-publish when timer reaches 0
          handleAutoPublish()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAutoPublish = async () => {
    setIsAutoPublishing(true)
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "publish" }),
      })

      if (response.ok) {
        toast.success("Article published automatically!")
        router.push(`/blog/${slug}`)
        onClose()
      } else {
        toast.error("Failed to auto-publish article")
      }
    } catch (error) {
      console.error("Error auto-publishing article:", error)
      toast.error("Failed to auto-publish article")
    } finally {
      setIsAutoPublishing(false)
    }
  }

  const handleReview = () => {
    router.push(`/dashboard/articles/${articleId}/edit`)
    onClose()
  }

  const handlePublishNow = async () => {
    setIsAutoPublishing(true)
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "publish" }),
      })

      if (response.ok) {
        toast.success("Article published successfully!")
        router.push(`/blog/${slug}`)
        onClose()
      } else {
        toast.error("Failed to publish article")
      }
    } catch (error) {
      console.error("Error publishing article:", error)
      toast.error("Failed to publish article")
    } finally {
      setIsAutoPublishing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">🎉 Article Generated Successfully!</CardTitle>
              <CardDescription>Your blog post is ready for review</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium line-clamp-2">{title}</h3>
            <Badge variant="secondary" className="text-xs">
              Draft • Ready for Review
            </Badge>
          </div>

          {timeLeft > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Auto-publish in {formatTime(timeLeft)}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((120 - timeLeft) / 120) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleReview}
              variant="outline"
              className="w-full"
              disabled={isAutoPublishing}
            >
              <Eye className="h-4 w-4 mr-2" />
              Review
            </Button>
            <Button
              onClick={handlePublishNow}
              className="w-full"
              disabled={isAutoPublishing || timeLeft === 0}
            >
              <Globe className="h-4 w-4 mr-2" />
              {isAutoPublishing ? "Publishing..." : "Publish Now"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            If you don&apos;t take action, the article will be published automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
