import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"

// Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!user[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const { password, ...userWithoutPassword } = user[0]

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

// Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { role, tier, name, email } = body

    // Validate the update data
    const updateData: any = { updatedAt: new Date() }
    
    if (role && ["user", "admin"].includes(role)) {
      updateData.role = role
    }
    
    if (tier && ["free", "premium"].includes(tier)) {
      updateData.tier = tier
    }
    
    if (name !== undefined) {
      updateData.name = name
    }
    
    if (email && typeof email === "string") {
      // Check if email is already taken by another user
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
      
      if (existingUser[0] && existingUser[0].id !== id) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }
      
      updateData.email = email
    }

    // Prevent admin from removing their own admin role
    if (role === "user" && session.user.id === id) {
      return NextResponse.json(
        { error: "Cannot remove your own admin privileges" },
        { status: 400 }
      )
    }

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning()

    if (!updatedUser[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const { password, ...userWithoutPassword } = updatedUser[0]

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prevent admin from deleting themselves
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      )
    }

    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning()

    if (!deletedUser[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
