"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  PenTool, 
  FileText, 
  BarChart3, 
  Settings, 
  User, 
  Crown, 
  Zap,
  ArrowRight,
  Calendar,
  TrendingUp
} from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string
  role: "user" | "admin"
  tier: "free" | "premium"
  createdAt: Date
}

interface UserDashboardProps {
  user: User
}

export function UserDashboard({ user }: UserDashboardProps) {
  const isPremium = user.tier === "premium"
  const isAdmin = user.role === "admin"

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* User Status Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-4 mb-6 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Badge variant={isPremium ? "default" : "secondary"} className="flex items-center space-x-1">
                {isPremium && <Crown className="h-3 w-3" />}
                <span>{isPremium ? "Premium" : "Free"} User</span>
              </Badge>
              {isAdmin && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <Settings className="h-3 w-3" />
                  <span>Admin</span>
                </Badge>
              )}
            </div>
          </div>
          {!isPremium && (
            <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Link href="/upgrade">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Premium Features Highlight - Premium Users Only */}
      {isPremium && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 mb-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Premium Features Available</h3>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <Zap className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link href="/dashboard/settings?tab=profile">
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link href="/dashboard/settings?tab=billing">
                <Calendar className="h-4 w-4 mr-2" />
                Billing & Invoices
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link href="/dashboard/settings?tab=notifications">
                <Settings className="h-4 w-4 mr-2" />
                Email Notifications
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link href="/dashboard/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Advanced Analytics
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Generate Article */}
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <PenTool className="h-5 w-5 text-blue-600" />
              <span>Generate Article</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create AI-powered blog posts on any topic instantly.
            </p>
            <Button asChild className="w-full">
              <Link href="/generate">
                Start Writing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* My Articles */}
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FileText className="h-5 w-5 text-green-600" />
              <span>My Articles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View, edit, and manage your published articles.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/articles">
                View Articles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Analytics - Premium/Admin only */}
        {(isPremium || isAdmin) && (
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>Analytics</span>
                {isPremium && <Zap className="h-4 w-4 text-yellow-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track performance and engagement metrics.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/analytics">
                  View Analytics
                  <TrendingUp className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Admin Panel - Admin only */}
        {isAdmin && (
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-red-200 dark:border-red-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Settings className="h-5 w-5 text-red-600" />
                <span>Admin Panel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage users, content, and system settings.
              </p>
              <Button asChild variant="destructive" className="w-full">
                <Link href="/admin">
                  Admin Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Profile Settings */}
        <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <User className="h-5 w-5 text-gray-600" />
              <span>Profile & Settings</span>
              {isPremium && <Zap className="h-4 w-4 text-yellow-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {isPremium 
                ? "Access premium profile settings, billing, and advanced preferences."
                : "Update your profile and account preferences."
              }
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/settings">
                {isPremium ? "Premium Settings" : "Manage Account"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats for Premium/Admin */}
        {(isPremium || isAdmin) && (
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <span>Account Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since:</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account type:</span>
                  <span className="font-medium">{isPremium ? "Premium" : "Free"}</span>
                </div>
                {isAdmin && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-medium text-red-600">Administrator</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Premium Features Teaser for Free Users */}
      {!isPremium && !isAdmin && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Crown className="h-5 w-5 text-purple-600" />
              <span>Unlock Premium Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Advanced Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Priority AI Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Unlimited Articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Advanced Customization</span>
              </div>
            </div>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Link href="/upgrade">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium - $9.99/month
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
