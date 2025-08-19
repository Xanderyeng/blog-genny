import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { PremiumSettings } from "@/components/premium-settings"

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

  return <PremiumSettings user={user} />
}
