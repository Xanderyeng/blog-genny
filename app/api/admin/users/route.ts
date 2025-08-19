import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, articles } from "@/lib/schema"
import { sql, count, desc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get URL parameters for pagination
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    // Get users with article count
    const usersWithStats = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        tier: users.tier,
        image: users.image,
        createdAt: users.createdAt,
        stripeSubscriptionId: users.stripeSubscriptionId,
        articleCount: count(articles.id),
      })
      .from(users)
      .leftJoin(articles, sql`${users.id} = ${articles.authorId}`)
      .groupBy(
        users.id,
        users.name,
        users.email,
        users.role,
        users.tier,
        users.image,
        users.createdAt,
        users.stripeSubscriptionId
      )
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset)

    // Format the response
    const formattedUsers = usersWithStats.map(user => ({
      ...user,
      _count: {
        articles: user.articleCount || 0
      }
    }))

    // Get total count for pagination
    const [totalCountResult] = await db
      .select({ count: count() })
      .from(users)

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: totalCountResult.count,
        totalPages: Math.ceil(totalCountResult.count / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
