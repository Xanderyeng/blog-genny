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

export interface Article {
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
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading articles...</span>
      </div>
    )
  }

  if (isError && !initialArticles) {
    return (
      <div className="flex justify-center items-center p-8 text-red-500">
        Error loading articles. Please try again.
      </div>
    )
  } return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="gap-4 grid md:grid-cols-3">
        <Card className="glass-light">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Draft Articles</CardTitle>
            <Badge variant="secondary">{stats.draft}</Badge>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.draft}</div>
            <p className="text-muted-foreground text-xs">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="glass-light">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Published</CardTitle>
            <Badge variant="default">{stats.published}</Badge>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.published}</div>
            <p className="text-muted-foreground text-xs">Live articles</p>
          </CardContent>
        </Card>

        <Card className="glass-light">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Articles</CardTitle>
            <Badge variant="outline">{stats.draft + stats.published + stats.archived}</Badge>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.draft + stats.published + stats.archived}</div>
            <p className="text-muted-foreground text-xs">All time</p>
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
                      <div className="text-muted-foreground text-sm">/{article.slug}</div>
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
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 w-4 h-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                        {article.status === "draft" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(article.id, "published")} disabled={isMutating}>
                            <CheckCircle className="mr-2 w-4 h-4" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(article.id)} disabled={isMutating}>
                          <Trash2 className="mr-2 w-4 h-4" />
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
            <div className="py-8 text-muted-foreground text-center">
              No articles found. Generate your first article to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
