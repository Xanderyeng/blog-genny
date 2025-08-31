"use server"

import { z } from "zod"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

const resetPasswordSchema = z.object({
  userId: z.string(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters long."),
})

interface ResetPasswordResult {
  success: boolean
  error?: string
}

export async function resetPassword(
  values: z.infer<typeof resetPasswordSchema>
): Promise<ResetPasswordResult> {
  try {
    const validatedFields = resetPasswordSchema.safeParse(values)
    if (!validatedFields.success) {
      return { success: false, error: "Invalid fields provided." }
    }

    const { userId, currentPassword, newPassword } = validatedFields.data

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated." }
    }

    const targetUserArr = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))

    const targetUser = targetUserArr[0]

    if (!targetUser) {
      return { success: false, error: "User not found." }
    }

    // Scenario 1: Admin resetting a user's password
    if (session.user.role === "admin" && session.user.id !== userId) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await db
        .update(users)
        .set({ password: hashedPassword, updatedAt: new Date() })
        .where(eq(users.id, userId))

      revalidatePath("/admin/users")
      return { success: true }
    }

    // Scenario 2: User resetting their own password
    if (session.user.id === userId) {
      if (!currentPassword || !targetUser.password) {
        return {
          success: false,
          error: "Current password is required to change your password.",
        }
      }

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        targetUser.password
      )

      if (!passwordMatch) {
        return { success: false, error: "Incorrect current password." }
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await db
        .update(users)
        .set({ password: hashedPassword, updatedAt: new Date() })
        .where(eq(users.id, userId))

      revalidatePath("/dashboard/settings")
      return { success: true }
    }

    // Scenario 3: Unauthorized attempt
    return { success: false, error: "You are not authorized to perform this action." }

  } catch (error) {
    console.error("Error resetting password:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}
