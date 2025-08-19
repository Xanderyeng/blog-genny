import { useQuery, useMutation } from "@tanstack/react-query"
import { useEffect, useCallback, useRef } from "react"

// Types
interface AnalyticsOverview {
    totalViews: number
    totalViewsChange: number
    uniqueVisitors: number
    uniqueVisitorsChange: number
    avgReadTime: string
    avgReadTimeChange: number
    bounceRate: number
    bounceRateChange: number
}

interface TopArticle {
    id: string
    title: string
    views: number
    readTime: string
}

interface TrafficSource {
    source: string
    percentage: number
    visitors: number
}

interface DeviceType {
    device: string
    percentage: number
}

interface RecentActivity {
    action: string
    time: string
    article: string | null
}

interface AnalyticsEvent {
    event: string
    page: string
    userId?: string
    sessionId?: string
}

// API functions
async function fetchAnalytics(metric?: string) {
    const url = metric ? `/api/analytics?metric=${metric}` : "/api/analytics"
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Failed to fetch analytics")
    }
    return response.json()
}

async function trackEvent(event: AnalyticsEvent) {
    const response = await fetch("/api/analytics", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
    })
    if (!response.ok) {
        throw new Error("Failed to track event")
    }
    return response.json()
}

// Query keys
export const analyticsKeys = {
    all: ["analytics"] as const,
    overview: () => [...analyticsKeys.all, "overview"] as const,
    topArticles: () => [...analyticsKeys.all, "topArticles"] as const,
    trafficSources: () => [...analyticsKeys.all, "trafficSources"] as const,
    deviceTypes: () => [...analyticsKeys.all, "deviceTypes"] as const,
    recentActivity: () => [...analyticsKeys.all, "recentActivity"] as const,
}

// Hooks
export function useAnalyticsOverview() {
    return useQuery({
        queryKey: analyticsKeys.overview(),
        queryFn: () => fetchAnalytics("overview"),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

export function useTopArticles() {
    return useQuery({
        queryKey: analyticsKeys.topArticles(),
        queryFn: () => fetchAnalytics("topArticles"),
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}

export function useTrafficSources() {
    return useQuery({
        queryKey: analyticsKeys.trafficSources(),
        queryFn: () => fetchAnalytics("trafficSources"),
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}

export function useDeviceTypes() {
    return useQuery({
        queryKey: analyticsKeys.deviceTypes(),
        queryFn: () => fetchAnalytics("deviceTypes"),
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}

export function useRecentActivity() {
    return useQuery({
        queryKey: analyticsKeys.recentActivity(),
        queryFn: () => fetchAnalytics("recentActivity"),
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

export function useTrackEvent() {
    return useMutation({
        mutationFn: trackEvent,
        onError: (error) => {
            console.error("Failed to track event:", error)
        },
    })
}

// Helper hook to automatically track page views (optimized to prevent re-renders)
export function usePageView(page: string, userId?: string) {
    const hasTrackedRef = useRef<string>("")

    // Create a stable tracking function
    const trackPageView = useCallback(async () => {
        const trackingKey = `${page}-${userId || 'anonymous'}`

        // Only track if we haven't tracked this combination before
        if (hasTrackedRef.current === trackingKey) return

        try {
            const sessionId = Math.random().toString(36).substring(7)

            await fetch("/api/analytics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    event: "page_view",
                    page,
                    userId,
                    sessionId,
                }),
            })

            hasTrackedRef.current = trackingKey
        } catch (error) {
            console.error("Failed to track page view:", error)
        }
    }, [page, userId])

    useEffect(() => {
        trackPageView()
    }, [trackPageView])
}

// Hook to get all analytics data at once
export function useAllAnalytics() {
    const overview = useAnalyticsOverview()
    const topArticles = useTopArticles()
    const trafficSources = useTrafficSources()
    const deviceTypes = useDeviceTypes()
    const recentActivity = useRecentActivity()

    return {
        overview,
        topArticles,
        trafficSources,
        deviceTypes,
        recentActivity,
        isLoading: overview.isLoading || topArticles.isLoading || trafficSources.isLoading || deviceTypes.isLoading || recentActivity.isLoading,
        isError: overview.isError || topArticles.isError || trafficSources.isError || deviceTypes.isError || recentActivity.isError,
    }
}
