import { NextRequest, NextResponse } from "next/server"
import { getArticles, getArticleStats } from "@/lib/articles"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get("limit")

       const options = limit ? { limit: parseInt(limit) } : {}
        const result = await getArticles(options)

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error fetching articles:", error)
        return NextResponse.json(
            { error: "Failed to fetch articles" },
            { status: 500 }
        )
    }
}
