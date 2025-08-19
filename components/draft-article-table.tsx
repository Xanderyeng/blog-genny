"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle, Loader2 } from "lucide-react"
import {
  useArticles,
  useArticleStats,
  usePublishArticle,
  useArchiveArticle,
  useDeleteArticle
} from "@/hooks/useArticles"

interface Article {
  id: string
  title: string
  slug: string
  status: "draft" | "published" | "archived"
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  author: {
    id: string
    name: string | null
    email: string
  } | null
}

interface ArticleStats {
  draft: number
  published: number
  archived: number
}

interface DraftArticleTableProps {
  initialArticles?: Article[]
  initialStats?: ArticleStats
}

export function DraftArticleTable({ initialArticles, initialStats }: DraftArticleTableProps) {
  // Using TanStack Query hooks
  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: articlesError
  } = useArticles(50)

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError
  } = useArticleStats()

  const publishMutation = usePublishArticle()
  const archiveMutation = useArchiveArticle()
  const deleteMutation = useDeleteArticle()

  // Use fetched data or fall back to initial data
  const articles = articlesData?.articles || initialArticles || []
  const stats = statsData || initialStats || { draft: 0, published: 0, archived: 0 }

  const handleStatusChange = (id: string, newStatus: "published" | "archived") => {
    if (newStatus === "published") {
      publishMutation.mutate(id)
    } else {
      archiveMutation.mutate(id)
    }
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return
    deleteMutation.mutate(id)
  }

  const isLoading = articlesLoading || statsLoading
  const isError = articlesError || statsError
  const isMutating = publishMutation.isPending || archiveMutation.isPending || deleteMutation.isPending

  if (isLoading && !initialArticles) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading articles...</span>
      </div>
    )
  }

  if (isError && !initialArticles) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Error loading articles. Please try again.
      </div>
    )
  } return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-light">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
            <Badge variant="secondary">{stats.draft}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="glass-light">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Badge variant="default">{stats.published}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Live articles</p>
          </CardContent>
        </Card>

        <Card className="glass-light">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Badge variant="outline">{stats.draft + stats.published + stats.archived}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft + stats.published + stats.archived}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Articles Table */}
      <Card className="glass-light">
        <CardHeader>
          <CardTitle>Articles Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{article.title}</div>
                      <div className="text-sm text-muted-foreground">/{article.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={article.status} />
                  </TableCell>
                  <TableCell>{article.author?.name || "Unknown"}</TableCell>
                  <TableCell>{new Date(article.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(article.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isMutating}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {article.status === "draft" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(article.id, "published")} disabled={isMutating}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(article.id)} disabled={isMutating}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {articles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No articles found. Generate your first article to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
