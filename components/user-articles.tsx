"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Plus,
  Calendar,
  User,
  BarChart3,
  EyeOff,
  CheckCircle,
  Archive,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Article = {
  id: string
  title: string
  slug: string
  description: string
  status: "draft" | "published" | "archived"
  createdAt: Date
  updatedAt: Date
  authorId: string
}

type User = {
  id: string
  name: string | null
  email: string
  role: "user" | "admin"
  tier: "free" | "premium"
}

interface UserArticlesProps {
  articles: Article[]
  user: User
}

type ArticleStatus = "all" | "published" | "draft" | "archived";

export function UserArticles({ articles, user }: UserArticlesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ArticleStatus>("all")
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleStatusChange = async (articleId: string, action: "publish" | "unpublish" | "archive") => {
    setIsLoading(articleId)
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        toast.success(`Article ${action}ed successfully!`)
        router.refresh()
      } else {
        toast.error(`Failed to ${action} article`)
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(null)
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    setIsLoading(articleId)
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Article deleted successfully!")
        router.refresh()
      } else {
        toast.error("Failed to delete article")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(null)
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || article.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date))
  }

  const statusCounts = {
    all: articles.length,
    published: articles.filter(a => a.status === "published").length,
    draft: articles.filter(a => a.status === "draft").length,
    archived: articles.filter(a => a.status === "archived").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Total Articles</p>
                <p className="font-bold text-2xl">{statusCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">Published</p>
                <p className="font-bold text-2xl">{statusCounts.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-sm">Drafts</p>
                <p className="font-bold text-2xl">{statusCounts.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Views</p>
                <p className="font-bold text-2xl">-</p>
                <p className="text-muted-foreground text-xs">Coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <div className="flex sm:flex-row flex-col gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ArticleStatus)}
            className="bg-background px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Status ({statusCounts.all})</option>
            <option value="published">Published ({statusCounts.published})</option>
            <option value="draft">Drafts ({statusCounts.draft})</option>
            <option value="archived">Archived ({statusCounts.archived})</option>
          </select>
        </div>

        <Button asChild>
          <Link href="/generate">
            <Plus className="mr-2 w-4 h-4" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">
              {articles.length === 0 ? "No articles yet" : "No articles found"}
            </h3>
            <p className="mb-4 text-muted-foreground">
              {articles.length === 0 
                ? "Start creating your first article to see it here."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {articles.length === 0 && (
              <Button asChild>
                <Link href="/generate">
                  <Plus className="mr-2 w-4 h-4" />
                  Create Your First Article
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {article.title}
                      </h3>
                      <Badge variant={getStatusColor(article.status)}>
                        {article.status}
                      </Badge>
                    </div>
                    
                    {article.description && (
                      <p className="mb-3 text-muted-foreground text-sm line-clamp-2">
                        {article.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-muted-foreground text-xs">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Created {formatDate(article.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Edit className="w-3 h-3" />
                        <span>Updated {formatDate(article.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{user.name || user.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Quick Action Buttons */}
                    {article.status === "published" && (
                      <Button asChild variant="outline" size="sm" title="View Published Article">
                        <Link href={`/blog/${article.slug}`} target="_blank">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    
                    <Button asChild variant="outline" size="sm" title="Edit Article">
                      <Link href={`/dashboard/articles/${article.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    
                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={isLoading === article.id}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {/* Status Change Actions */}
                        {article.status === "draft" && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(article.id, "publish")}
                            className="text-green-600"
                          >
                            <CheckCircle className="mr-2 w-4 h-4" />
                            Publish Article
                          </DropdownMenuItem>
                        )}
                        
                        {article.status === "published" && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(article.id, "unpublish")}
                            className="text-orange-600"
                          >
                            <EyeOff className="mr-2 w-4 h-4" />
                            Unpublish (Move to Draft)
                          </DropdownMenuItem>
                        )}
                        
                        {(article.status === "draft" || article.status === "published") && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(article.id, "archive")}
                            className="text-gray-600"
                          >
                            <Archive className="mr-2 w-4 h-4" />
                            Archive Article
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        {/* Edit Actions */}
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/articles/${article.id}/edit`}>
                            <Edit className="mr-2 w-4 h-4" />
                            Edit Content
                          </Link>
                        </DropdownMenuItem>
                        
                        {article.status === "published" && (
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${article.slug}`} target="_blank">
                              <Eye className="mr-2 w-4 h-4" />
                              View Live Article
                            </Link>
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        {/* Delete Action */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 w-4 h-4" />
                              Delete Article
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the article &quot;{article.title}&quot; and remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteArticle(article.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={isLoading === article.id}
                              >
                                {isLoading === article.id ? "Deleting..." : "Delete Article"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Premium Features for Free Users */}
      {user.tier === "free" && articles.length >= 5 && (
        <Card className="bg-gradient-to-r from-purple-50 dark:from-purple-950/20 to-blue-50 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <h3 className="mb-2 font-semibold text-lg">Unlock More Features</h3>
            <p className="mb-4 text-muted-foreground">
              Upgrade to Premium for unlimited articles, advanced analytics, and more.
            </p>
            <Button asChild className="bg-gradient-to-r from-purple-600 hover:from-purple-700 to-blue-600 hover:to-blue-700">
              <Link href="/upgrade">
                Upgrade to Premium
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}