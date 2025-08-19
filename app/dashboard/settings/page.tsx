import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { UserSettings } from "@/components/user-settings"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/auth/signin")
  }

  const userQuery = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1)
  
  const user = userQuery[0]
  
  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and profile information.
        </p>
      </div>
      
      <UserSettings user={user} />
    </div>
  )
}
