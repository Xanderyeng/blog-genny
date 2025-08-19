import { NextResponse } from "next/server"
import { getArticleStats } from "@/lib/articles"

export async function GET() {
    try {
        const result = await getArticleStats()
        return NextResponse.json(result)
    } catch (error) {
        console.error("Error fetching article stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch article stats" },
            { status: 500 }
        )
    }
}
