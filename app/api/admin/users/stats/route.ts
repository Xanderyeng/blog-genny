import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { sql, count, eq, gte } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current date and first day of current month
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get total users
    const [totalUsersResult] = await db
      .select({ count: count() })
      .from(users)

    // Get premium users
    const [premiumUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.tier, "premium"))

    // Get admin users
    const [adminUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "admin"))

    // Get new users this month
    const [newUsersThisMonthResult] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, firstDayOfMonth))

    // Calculate revenue (assuming $10/month for premium users)
    // In a real app, you'd calculate this from Stripe data
    const monthlyRevenue = premiumUsersResult.count * 10

    const stats = {
      totalUsers: totalUsersResult.count,
      premiumUsers: premiumUsersResult.count,
      freeUsers: totalUsersResult.count - premiumUsersResult.count,
      adminUsers: adminUsersResult.count,
      activeUsers: totalUsersResult.count, // Could be refined with last login tracking
      newUsersThisMonth: newUsersThisMonthResult.count,
      totalRevenue: monthlyRevenue,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    )
  }
}
