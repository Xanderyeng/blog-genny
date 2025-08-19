import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { DraftArticleTable } from "@/components/draft-article-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, TrendingUp, Clock } from "lucide-react"
import { getArticlesAction, getArticleStatsAction } from "@/app/actions/articleActions"

export default async function AdminDashboard() {
  // Fetch data on the server side
  const [articlesResult, statsResult] = await Promise.all([
    getArticlesAction({ limit: 50 }),
    getArticleStatsAction()
  ])

  const articles = articlesResult.success && articlesResult.data ? articlesResult.data.articles : []
  const stats = statsResult.success && statsResult.data ? statsResult.data : { draft: 0, published: 0, archived: 0 }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="glass-light rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Welcome back, Admin!</h2>
          <p className="text-muted-foreground">Here's what's happening with your blog today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-light">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
              <p className="text-xs text-muted-foreground">Articles pending review</p>
            </CardContent>
          </Card>

          <Card className="glass-light">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published}</div>
              <p className="text-xs text-muted-foreground">Live on the blog</p>
            </CardContent>
          </Card>

          <Card className="glass-light">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Archived Articles</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.archived}</div>
              <p className="text-xs text-muted-foreground">No longer active</p>
            </CardContent>
          </Card>

          <Card className="glass-light">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft + stats.published + stats.archived}</div>
              <p className="text-xs text-muted-foreground">All articles created</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="glass-light">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New article generated</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <Badge variant="secondary">Draft</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Article published</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <Badge variant="default">Published</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
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
              <div className="grid gap-2">
                <a
                  href="/admin/generate"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Generate New Article</span>
                  <FileText className="h-4 w-4" />
                </a>
                <a
                  href="/admin/articles"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Review Drafts</span>
                  <Badge variant="secondary">{stats.draft}</Badge>
                </a>
                <a
                  href="/admin/users"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Manage Users</span>
                  <Users className="h-4 w-4" />
                </a>
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
