"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  CheckCircle, 
  EyeOff,
  Archive,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Article = {
  id: string
  title: string
  slug: string
  content: string
  description: string
  status: "draft" | "published" | "archived"
  authorId: string
  metaTitle?: string | null
  metaDescription?: string | null
  tags?: string[] | null
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
}

interface ArticleEditFormProps {
  article: Article
}

export function ArticleEditForm({ article }: ArticleEditFormProps) {
  const [formData, setFormData] = useState({
    title: article.title,
    description: article.description,
    content: article.content,
    metaTitle: article.metaTitle || "",
    metaDescription: article.metaDescription || "",
    tags: article.tags?.join(", ") || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          metaTitle: formData.metaTitle || null,
          metaDescription: formData.metaDescription || null,
          tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : null,
        }),
      })

      if (response.ok) {
        toast.success("Article saved successfully!")
        router.refresh()
      } else {
        toast.error("Failed to save article")
      }
    } catch (error) {
      toast.error("An error occurred while saving")
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (action: "publish" | "unpublish" | "archive") => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        toast.success(`Article ${action}ed successfully!`)
        router.push("/dashboard/articles")
      } else {
        toast.error(`Failed to ${action} article`)
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/articles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Link>
          </Button>
          <Badge variant={getStatusColor(article.status)}>
            {article.status}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {article.status === "published" && (
            <Button variant="outline" asChild>
              <Link href={`/blog/${article.slug}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                View Live
              </Link>
            </Button>
          )}
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            variant="outline"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>

          {/* Status Change Actions */}
          {article.status === "draft" && (
            <Button 
              onClick={() => handleStatusChange("publish")}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Publish
            </Button>
          )}

          {article.status === "published" && (
            <Button 
              onClick={() => handleStatusChange("unpublish")}
              disabled={isLoading}
              variant="outline"
              className="text-orange-600 hover:text-orange-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <EyeOff className="h-4 w-4 mr-2" />
              )}
              Unpublish
            </Button>
          )}

          {(article.status === "draft" || article.status === "published") && (
            <Button 
              onClick={() => handleStatusChange("archive")}
              disabled={isLoading}
              variant="outline"
              className="text-gray-600 hover:text-gray-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Archive className="h-4 w-4 mr-2" />
              )}
              Archive
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter article title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the article"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (MDX)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Write your article content in MDX format"
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  placeholder="SEO title (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  placeholder="SEO description (optional)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="Comma-separated tags"
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas (e.g., react, typescript, tutorial)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle>Article Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={getStatusColor(article.status)}>
                    {article.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                </div>
                {article.publishedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published:</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slug:</span>
                  <span className="text-xs font-mono">{article.slug}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
