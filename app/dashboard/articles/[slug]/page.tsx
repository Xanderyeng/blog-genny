import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { articles, users } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { formatDate, getReadingTime } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArticleContentSection } from "@/components/article-content"

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    redirect("/auth/signin")
  }

  const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

  if (!user[0]) {
    redirect("/auth/signin")
  }

  const { slug } = await params

  const article = await db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.authorId, user[0].id)),
  })

  if (!article) {
    notFound()
  }

  return (
      <main className="bg-background min-h-screen">
        <div className="mx-auto px-4 py-8 max-w-4xl container">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/dashboard/articles">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Articles
              </Link>
            </Button>

            {article.coverImageUrl && (
              <div className="mb-8">
                <img
                  src={article.coverImageUrl}
                  alt={`Hero image for ${article.title}`}
                  className="shadow-lg rounded-lg w-full h-64 md:h-80 object-cover"
                />
                {article.coverImageAttribution && (
                  <div
                    className="mt-2 text-muted-foreground text-xs"
                    dangerouslySetInnerHTML={{
                      __html: article.coverImageAttribution || "",
                    }}
                  />
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={article.createdAt.toISOString()}>{formatDate(article.createdAt.toISOString())}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{getReadingTime(article.content || "")}</span>
                </div>
              </div>
              <h1 className="font-bold text-4xl tracking-tight">{article.title}</h1>
              {(article.description || article.metaDescription) && (
                <p className="text-muted-foreground text-xl">{article.description || article.metaDescription}</p>
              )}
            </div>
          </div>
          <ArticleContentSection content={article.content || ""} />
        </div>
      </main>
  )
}
