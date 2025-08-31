import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { Article, DraftArticleTable } from "@/components/draft-article-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, TrendingUp, Clock } from "lucide-react"
import { getArticlesAction } from "@/app/actions/articleActions"
import Link from 'next/link'
import { getArticleStatsAction } from '../actions/get-articles-action'

// Define interfaces for your data structures
interface Author {
  id: string;
  name: string | null;
  email: string;
}

// interface Article {
//   id: string;
//   title: string;
//   status: 'draft' | 'published' | 'archived'; // Example statuses
//   authorId?: string; // Original authorId from the data
//   author?: Author; // Enriched author object
// }

interface GetArticlesResult {
  success: boolean;
  data?: {
    articles: Article[];
  };
  error?: string;
}

interface ArticleStats {
  draft: number;
  published: number;
  archived: number;
}

interface GetArticleStatsResult {
  success: boolean;
  data?: ArticleStats;
  error?: string;
}

export default async function AdminDashboard() {
  // Fetch data on the server side
  const [articlesResult, statsResult] = await Promise.all([
    getArticlesAction({ limit: 50 }) as Promise<GetArticlesResult>,
    getArticleStatsAction() as Promise<GetArticleStatsResult>
  ])

  // Process articles data, ensuring author information is present
  const articles: Article[] = articlesResult.success && articlesResult.data
    ? articlesResult.data.articles.map((article) => ({
        ...article,
        author: article.author
          ? article.author
          : {
              id: article.author ?? "",
              name: null,
              email: "",
            },
      }))
    : []

  const stats: ArticleStats = {
    draft: statsResult.data?.draft ?? 0,
    published: statsResult.data?.published ?? 0,
    archived: statsResult.data?.archived ?? 0,
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="p-6 rounded-lg glass-light">
          <h2 className="mb-2 font-semibold text-xl">Welcome back, Admin!</h2>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your blog today.</p>
        </div>

        {/* Quick Stats */}
        <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-light">
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Draft Articles</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stats.draft}</div>
              <p className="text-muted-foreground text-xs">Articles pending review</p>
            </CardContent>
          </Card>

          <Card className="glass-light">
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Published Articles</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stats.published}</div>
              <p className="text-muted-foreground text-xs">Live on the blog</p>
            </CardContent>
          </Card>

          <Card className="glass-light">
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Archived Articles</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stats.archived}</div>
              <p className="text-muted-foreground text-xs">No longer active</p>
            </CardContent>
          </Card>

          <Card className="glass-light">
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">Total Articles</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stats.draft + stats.published + stats.archived}</div>
              <p className="text-muted-foreground text-xs">All articles created</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="gap-6 grid lg:grid-cols-2">
          <Card className="glass-light">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500 rounded-full w-2 h-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">New article generated</p>
                  <p className="text-muted-foreground text-xs">2 minutes ago</p>
                </div>
                <Badge variant="secondary">Draft</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 rounded-full w-2 h-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Article published</p>
                  <p className="text-muted-foreground text-xs">1 hour ago</p>
                </div>
                <Badge variant="default">Published</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-orange-500 rounded-full w-2 h-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">New user registered</p>
                  <p className="text-muted-foreground text-xs">3 hours ago</p>
                </div>
                <Badge variant="outline">User</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-light">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="gap-2 grid">
                <a
                  href="/admin/generate"
                  className="flex justify-between items-center hover:bg-accent p-3 border rounded-lg transition-colors"
                >
                  <span className="font-medium">Generate New Article</span>
                  <FileText className="w-4 h-4" />
                </a>
                <Link
                  href="/admin/articles"
                  className="flex justify-between items-center hover:bg-accent p-3 border rounded-lg transition-colors"
                >
                  <span className="font-medium">Review Drafts</span>
                  <Badge variant="secondary">{stats.draft}</Badge>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex justify-between items-center hover:bg-accent p-3 border rounded-lg transition-colors"
                >
                  <span className="font-medium">Manage Users</span>
                  <Users className="w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles Overview */}
        <DraftArticleTable initialArticles={articles} initialStats={stats} />
      </div>
    </AdminDashboardLayout>
  )
}