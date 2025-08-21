import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, articles } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import { redirect, notFound } from "next/navigation"
import { ArticleEditForm } from "@/components/article-edit-form"

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }> // Updated params type for Next.js 15
}) {
  const { id } = await params

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/signin")
  }

  const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

  if (!user[0]) {
    redirect("/auth/signin")
  }

  // Get the article and verify ownership
  const article = await db
    .select()
    .from(articles)
    .where(and(eq(articles.id, id), eq(articles.authorId, user[0].id))) // Use destructured id
    .limit(1)

  if (!article[0]) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl tracking-tight">Edit Article</h1>
        <p className="text-muted-foreground">Make changes to your article and save when ready.</p>
      </div>

      <ArticleEditForm article={article[0]} />
    </div>
  )
}
