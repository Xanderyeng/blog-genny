import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, articles } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import { redirect, notFound } from "next/navigation"
import { ArticleLayout } from "@/components/article-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, ArrowLeft } from "lucide-react"

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
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
    .where(and(eq(articles.id, id), eq(articles.authorId, user[0].id)))
    .limit(1)

  if (!article[0]) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/articles">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Articles
            </Link>
          </Button>
        </div>
        <Button asChild>
          <Link href={`/dashboard/articles/${article[0].id}/edit`}>
            <Edit className="mr-2 w-4 h-4" />
            Edit Article
          </Link>
        </Button>
      </div>

      <ArticleLayout
        title={article[0].title}
        publishedAt={article[0].createdAt.toISOString().split("T")[0]}
        author={user[0].name || user[0].email}
        coverImageUrl={article[0].coverImageUrl ?? undefined}
        coverImageAttribution={article[0].coverImageAttribution ?? undefined}
        content={article[0].content}
      />
    </div>
  )
}
