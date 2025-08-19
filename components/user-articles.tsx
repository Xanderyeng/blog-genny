"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  BarChart3
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
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

export function UserArticles({ articles, user }: UserArticlesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all")

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Articles</p>
                <p className="text-2xl font-bold">{statusCounts.all}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-2xl font-bold">{statusCounts.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Drafts</p>
                <p className="text-2xl font-bold">{statusCounts.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Views</p>
                <p className="text-2xl font-bold">-</p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm bg-background"
          >
            <option value="all">All Status ({statusCounts.all})</option>
            <option value="published">Published ({statusCounts.published})</option>
            <option value="draft">Drafts ({statusCounts.draft})</option>
            <option value="archived">Archived ({statusCounts.archived})</option>
          </select>
        </div>

        <Button asChild>
          <Link href="/generate">
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {articles.length === 0 ? "No articles yet" : "No articles found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {articles.length === 0 
                ? "Start creating your first article to see it here."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {articles.length === 0 && (
              <Button asChild>
                <Link href="/generate">
                  <Plus className="h-4 w-4 mr-2" />
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
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold truncate">
                        {article.title}
                      </h3>
                      <Badge variant={getStatusColor(article.status)}>
                        {article.status}
                      </Badge>
                    </div>
                    
                    {article.excerpt && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created {formatDate(article.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Edit className="h-3 w-3" />
                        <span>Updated {formatDate(article.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{user.name || user.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {article.status === "published" && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/blog/${article.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/articles/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Premium Features for Free Users */}
      {user.tier === "free" && articles.length >= 5 && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Unlock More Features</h3>
            <p className="text-muted-foreground mb-4">
              Upgrade to Premium for unlimited articles, advanced analytics, and more.
            </p>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
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
