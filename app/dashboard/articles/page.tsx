import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, articles } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card"; // Assuming you have an ArticleCard component
import { TerminalIcon } from "lucide-react";
import { Card } from '@/components/ui/card';
import { NewArticleDialog } from '@/components/articles/new-article-dialog';
import { getReadingTime } from '@/lib/utils';

export default async function ArticlesListPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);

  if (!user[0]) {
    redirect("/auth/signin");
  }

  // Fetch all articles for the logged-in user
  const userArticles = await db.select().from(articles).where(eq(articles.authorId, user[0].id));

  return (
    <div className="space-y-8 mx-auto max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Your Articles</h1>
      </div>

      {userArticles.length === 0 ? (
        <Card className="flex flex-col justify-center items-center p-8 border-dashed text-center">
          <TerminalIcon className="mb-4 w-12 h-12 text-muted-foreground" />
          <h2 className="mb-2 font-semibold text-xl">No articles generated yet.</h2>
          <p className="mb-6 text-muted-foreground">
            Get started by creating your first AI-powered article.
          </p>
          {/* ✅ Use the dialog component for the "Generate Article" button */}
          <NewArticleDialog />
        </Card>
      ) : (
        <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
          {userArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article} // ✅ Pass the article object directly
            />
          ))}
        </div>
      )}
    </div>
  );
}