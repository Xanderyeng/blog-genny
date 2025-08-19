import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, articles } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { UserArticles } from "@/components/user-articles"

export default async function ArticlesPage() {
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

  // Get user's articles
  const userArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.authorId, user.id))
    .orderBy(articles.createdAt)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Articles</h1>
        <p className="text-muted-foreground">
          Manage your published articles and drafts.
        </p>
      </div>
      
      <UserArticles articles={userArticles} user={user} />
    </div>
  )
}
