"use client"

import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Eye,
    Users,
    Clock,
    MessageSquare,
    Calendar,
    Globe,
    Smartphone,
    Monitor,
    Tablet,
    Loader2
} from "lucide-react"
import { useAllAnalytics, usePageView } from "@/hooks/useAnalytics"

interface TopArticle {
    title: string;
    views?: number;
    readTime: string; // Assuming it's a string like "5 min" or similar
}

interface TrafficSource {
    source: string;
    visitors?: number;
    percentage: number;
}

interface DeviceType {
    device: "Desktop" | "Mobile" | "Tablet";
    percentage: number;
}

interface RecentActivity {
    action: string;
    article?: string;
    time: string;
}

export default function AnalyticsPage() {
    // Track page view
    usePageView("/admin/analytics")

    // Fetch analytics data
    const { overview, topArticles, trafficSources, deviceTypes, recentActivity, isLoading, isError } = useAllAnalytics()

    if (isError) {
        return (
            <AdminDashboardLayout>
                <div className="flex items-center justify-center p-8 text-red-500">
                    <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Failed to load analytics</h2>
                        <p>Please try refreshing the page.</p>
                    </div>
                </div>
            </AdminDashboardLayout>
        )
    }

    return (
        <AdminDashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="glass-light rounded-lg p-6">
                    <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Track your blog&apos;s performance and engagement metrics.</p>
                </div>

                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="glass-light">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{overview.data?.totalViews?.toLocaleString() || 0}</div>
                                    <div className="flex items-center text-xs">
                                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                        <span className="text-green-500">+{overview.data?.totalViewsChange || 0}%</span>
                                        <span className="text-muted-foreground ml-1">from last month</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-light">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{overview.data?.uniqueVisitors?.toLocaleString() || 0}</div>
                                    <div className="flex items-center text-xs">
                                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                                        <span className="text-red-500">{overview.data?.uniqueVisitorsChange || 0}%</span>
                                        <span className="text-muted-foreground ml-1">from last month</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-light">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Read Time</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{overview.data?.avgReadTime || "0:00"}</div>
                                    <div className="flex items-center text-xs">
                                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                                        <span className="text-green-500">+{overview.data?.avgReadTimeChange || 0}%</span>
                                        <span className="text-muted-foreground ml-1">from last month</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-light">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{overview.data?.bounceRate || 0}%</div>
                                    <div className="flex items-center text-xs">
                                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                                        <span className="text-green-500">{overview.data?.bounceRateChange || 0}%</span>
                                        <span className="text-muted-foreground ml-1">from last month</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Top Performing Articles */}
                    <Card className="glass-light">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Top Performing Articles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <Skeleton key={index} className="h-16 w-full" />
                                ))
                            ) : (
                                topArticles.data?.map((article: TopArticle, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{article.title}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {article.views?.toLocaleString()} views • {article.readTime} avg read time
                                            </div>
                                        </div>
                                        <Badge variant="secondary">#{index + 1}</Badge>
                                    </div>
                                )) || <div className="text-center text-muted-foreground">No data available</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Traffic Sources */}
                    <Card className="glass-light">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Traffic Sources
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-2 w-full" />
                                    </div>
                                ))
                            ) : (
                                trafficSources.data?.map((source: TrafficSource, index: number) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{source.source}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {source.visitors?.toLocaleString()} visitors
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${source.percentage}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground">{source.percentage}%</div>
                                    </div>
                                )) || <div className="text-center text-muted-foreground">No data available</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Device Types */}
                    <Card className="glass-light">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-5 w-5" />
                                Device Types
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <Skeleton key={index} className="h-16 w-full" />
                                ))
                            ) : (
                                deviceTypes.data?.map((device: DeviceType, index: number) => {
                                    const IconComponent = device.device === "Desktop" ? Monitor :
                                        device.device === "Mobile" ? Smartphone : Tablet
                                    return (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div className="flex items-center gap-3">
                                                <IconComponent className="h-5 w-5 text-muted-foreground" />
                                                <span className="font-medium">{device.device}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">{device.percentage}%</div>
                                                <div className="text-xs text-muted-foreground">of visitors</div>
                                            </div>
                                        </div>
                                    )
                                }) || <div className="text-center text-muted-foreground">No data available</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="glass-light">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <Skeleton key={index} className="h-16 w-full" />
                                ))
                            ) : (
                                recentActivity.data?.map((activity: RecentActivity, index: number) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{activity.action}</p>
                                            {activity.article && (
                                                <p className="text-xs text-muted-foreground mt-1">{activity.article}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                )) || <div className="text-center text-muted-foreground">No recent activity</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section - Placeholder for future charts */}
                <Card className="glass-light">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Traffic Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                            <div className="text-center">
                                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-muted-foreground">Chart Coming Soon</h3>
                                <p className="text-sm text-muted-foreground">
                                    Interactive charts will be added in a future update
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminDashboardLayout>
    )
}