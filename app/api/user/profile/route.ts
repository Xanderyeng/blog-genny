import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { 
      name, 
      bio, 
      location, 
      website, 
      twitter, 
      linkedin, 
      github, 
      instagram 
    } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 })
    }

    // In a real app, you might want to store extended profile data in a separate table
    // For now, we'll just update the name field and log the other data
    // You could extend the users table schema or create a profiles table

    // Update user profile
    await db
      .update(users)
      .set({ 
        name: name.trim(),
        updatedAt: new Date()
      })
      .where(eq(users.email, session.user.email))

    // TODO: Store extended profile data in a profiles table
    // await db.update(profiles).set({
    //   bio,
    //   location,
    //   website,
    //   twitter,
    //   linkedin,
    //   github,
    //   instagram,
    //   updatedAt: new Date()
    // }).where(eq(profiles.userId, userId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
