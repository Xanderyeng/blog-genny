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
                <div className="flex justify-center items-center p-8 text-red-500">
                    <div className="text-center">
                        <BarChart3 className="mx-auto mb-4 w-12 h-12" />
                        <h2 className="mb-2 font-semibold text-xl">Failed to load analytics</h2>
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
                <div className="p-6 rounded-lg glass-light">
                    {/* <h1 className="mb-2 font-bold text-3xl">Analytics Dashboard</h1> */}
                    <p className="text-muted-foreground">Track your blog&apos;s performance and engagement metrics.</p>
                </div>

                {/* Key Metrics */}
                <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
                    <Card className="glass-light">
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">Total Views</CardTitle>
                            <Eye className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="w-20 h-8" />
                                    <Skeleton className="w-32 h-4" />
                                </div>
                            ) : (
                                <>
                                    <div className="font-bold text-2xl">{overview.data?.totalViews?.toLocaleString() || 0}</div>
                                    <div className="flex items-center text-xs">
                                        <TrendingUp className="mr-1 w-3 h-3 text-green-500" />
                                        <span className="text-green-500">+{overview.data?.totalViewsChange || 0}%</span>
                                        <span className="ml-1 text-muted-foreground">from last month</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-light">
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">Unique Visitors</CardTitle>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="w-20 h-8" />
                                    <Skeleton className="w-32 h-4" />
                                </div>
                            ) : (
                                <>
                                    <div className="font-bold text-2xl">{overview.data?.uniqueVisitors?.toLocaleString() || 0}</div>
                                    <div className="flex items-center text-xs">
                                        <TrendingDown className="mr-1 w-3 h-3 text-red-500" />
                                        <span className="text-red-500">{overview.data?.uniqueVisitorsChange || 0}%</span>
                                        <span className="ml-1 text-muted-foreground">from last month</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-light">
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">Avg. Read Time</CardTitle>
                            <Clock className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="w-20 h-8" />
                                    <Skeleton className="w-32 h-4" />
                                </div>
                            ) : (
                                <>
                                    <div className="font-bold text-2xl">{overview.data?.avgReadTime || "0:00"}</div>
                                    <div className="flex items-center text-xs">
                                        <TrendingUp className="mr-1 w-3 h-3 text-green-500" />
                                        <span className="text-green-500">+{overview.data?.avgReadTimeChange || 0}%</span>
                                        <span className="ml-1 text-muted-foreground">from last month</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-light">
                        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">Bounce Rate</CardTitle>
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="w-20 h-8" />
                                    <Skeleton className="w-32 h-4" />
                                </div>
                            ) : (
                                <>
                                    <div className="font-bold text-2xl">{overview.data?.bounceRate || 0}%</div>
                                    <div className="flex items-center text-xs">
                                        <TrendingDown className="mr-1 w-3 h-3 text-red-500" />
                                        <span className="text-green-500">{overview.data?.bounceRateChange || 0}%</span>
                                        <span className="ml-1 text-muted-foreground">from last month</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="gap-6 grid lg:grid-cols-2">
                    {/* Top Performing Articles */}
                    <Card className="glass-light">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Top Performing Articles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <Skeleton key={index} className="w-full h-16" />
                                ))
                            ) : (
                                topArticles.data?.map((article: TopArticle, index: number) => (
                                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{article.title}</div>
                                            <div className="mt-1 text-muted-foreground text-xs">
                                                {article.views?.toLocaleString()} views • {article.readTime} avg read time
                                            </div>
                                        </div>
                                        <Badge variant="secondary">#{index + 1}</Badge>
                                    </div>
                                )) || <div className="text-muted-foreground text-center">No data available</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Traffic Sources */}
                    <Card className="glass-light">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Traffic Sources
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="space-y-2">
                                        <Skeleton className="w-full h-4" />
                                        <Skeleton className="w-full h-2" />
                                    </div>
                                ))
                            ) : (
                                trafficSources.data?.map((source: TrafficSource, index: number) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-sm">{source.source}</span>
                                            <span className="text-muted-foreground text-sm">
                                                {source.visitors?.toLocaleString()} visitors
                                            </span>
                                        </div>
                                        <div className="bg-muted rounded-full w-full h-2">
                                            <div
                                                className="bg-primary rounded-full h-2 transition-all duration-300"
                                                style={{ width: `${source.percentage}%` }}
                                            />
                                        </div>
                                        <div className="text-muted-foreground text-xs">{source.percentage}%</div>
                                    </div>
                                )) || <div className="text-muted-foreground text-center">No data available</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="gap-6 grid lg:grid-cols-2">
                    {/* Device Types */}
                    <Card className="glass-light">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="w-5 h-5" />
                                Device Types
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <Skeleton key={index} className="w-full h-16" />
                                ))
                            ) : (
                                deviceTypes.data?.map((device: DeviceType, index: number) => {
                                    const IconComponent = device.device === "Desktop" ? Monitor :
                                        device.device === "Mobile" ? Smartphone : Tablet
                                    return (
                                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <IconComponent className="w-5 h-5 text-muted-foreground" />
                                                <span className="font-medium">{device.device}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">{device.percentage}%</div>
                                                <div className="text-muted-foreground text-xs">of visitors</div>
                                            </div>
                                        </div>
                                    )
                                }) || <div className="text-muted-foreground text-center">No data available</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="glass-light">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <Skeleton key={index} className="w-full h-16" />
                                ))
                            ) : (
                                recentActivity.data?.map((activity: RecentActivity, index: number) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                                        <div className="bg-primary mt-2 rounded-full w-2 h-2"></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{activity.action}</p>
                                            {activity.article && (
                                                <p className="mt-1 text-muted-foreground text-xs">{activity.article}</p>
                                            )}
                                            <p className="mt-1 text-muted-foreground text-xs">{activity.time}</p>
                                        </div>
                                    </div>
                                )) || <div className="text-muted-foreground text-center">No recent activity</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section - Placeholder for future charts */}
                <Card className="glass-light">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Traffic Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center items-center border-2 border-dashed rounded-lg h-64">
                            <div className="text-center">
                                <BarChart3 className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                                <h3 className="font-semibold text-muted-foreground text-lg">Chart Coming Soon</h3>
                                <p className="text-muted-foreground text-sm">
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