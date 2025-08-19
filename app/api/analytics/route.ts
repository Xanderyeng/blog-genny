import { NextRequest, NextResponse } from "next/server"

// Mock analytics data - in a real app, you'd connect to analytics services like Google Analytics, Plausible, etc.
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const metric = searchParams.get("metric")

        // Mock data based on metric type
        const mockData = {
            overview: {
                totalViews: 24678,
                totalViewsChange: 12.5,
                uniqueVisitors: 8934,
                uniqueVisitorsChange: -2.3,
                avgReadTime: "3:24",
                avgReadTimeChange: 8.1,
                bounceRate: 32.4,
                bounceRateChange: -5.2,
            },
            topArticles: [
                { id: "1", title: "How to Implement Authentication in Next.js 15", views: 1234, readTime: "5:32" },
                { id: "2", title: "The Future of AI: Additional Instructions", views: 987, readTime: "4:18" },
                { id: "3", title: "Is PostgreSQL a Swiss Army Knife for Developers?", views: 756, readTime: "3:45" },
                { id: "4", title: "Free Tools to Track Coding Time in VS Code", views: 543, readTime: "2:56" },
                { id: "5", title: "Welcome to Blog Genny", views: 432, readTime: "1:42" },
            ],
            trafficSources: [
                { source: "Organic Search", percentage: 45.2, visitors: 4038 },
                { source: "Direct", percentage: 28.7, visitors: 2564 },
                { source: "Social Media", percentage: 15.1, visitors: 1349 },
                { source: "Referral", percentage: 11.0, visitors: 983 },
            ],
            deviceTypes: [
                { device: "Desktop", percentage: 52.3 },
                { device: "Mobile", percentage: 39.8 },
                { device: "Tablet", percentage: 7.9 },
            ],
            recentActivity: [
                { action: "New article published", time: "2 hours ago", article: "Authentication in Next.js 15" },
                { action: "High traffic spike", time: "4 hours ago", article: "PostgreSQL Guide" },
                { action: "New user registration", time: "6 hours ago", article: null },
                { action: "Article shared on social media", time: "8 hours ago", article: "AI Future Trends" },
            ]
        }

        if (metric && mockData[metric as keyof typeof mockData]) {
            return NextResponse.json(mockData[metric as keyof typeof mockData])
        }

        return NextResponse.json(mockData)
    } catch (error) {
        console.error("Error fetching analytics:", error)
        return NextResponse.json(
            { error: "Failed to fetch analytics data" },
            { status: 500 }
        )
    }
}

// Track page views or events
export async function POST(request: NextRequest) {
    try {
        const { event, page, userId, sessionId } = await request.json()

        // In a real app, you'd store this in your analytics database
        console.log("Analytics event:", { event, page, userId, sessionId, timestamp: new Date() })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error tracking analytics:", error)
        return NextResponse.json(
            { error: "Failed to track analytics" },
            { status: 500 }
        )
    }
}
