import { db } from "@/lib/db"
import { articles, articleTopics } from "@/lib/schema"
import { eq, desc, and, or, like, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

// Export missing article status change functions
export async function publishArticle(id: string) {
  return updateArticle(id, { status: "published" })
}

export async function archiveArticle(id: string) {
  return updateArticle(id, { status: "archived" })
}

export async function unpublishArticle(id: string) {
  return updateArticle(id, { status: "draft" })
}

// Export getArticleBySlug for blog page
export async function getArticleBySlug(slug: string) {
  const result = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1)
  return result[0] || null
}

export type ArticleStatus = "draft" | "published" | "archived"

export interface CreateArticleData {
  title: string
  content: string
  description: string
  authorId: string
  coverImageUrl?: string
  coverImageAttribution?: string
  heroImage?: string
  heroImageAttribution?: string
  metaTitle?: string
  metaDescription?: string
  status?: ArticleStatus
  topicIds?: string[]
}

export interface UpdateArticleData {
  title?: string
  content?: string
  description?: string
  coverImageUrl?: string
  coverImageAttribution?: string
  heroImage?: string
  heroImageAttribution?: string
  metaTitle?: string
  metaDescription?: string
  status?: ArticleStatus
  topicIds?: string[]
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100) // Limit length
}

// Create a new article
export async function createArticle(data: CreateArticleData) {
  try {
    const id = nanoid()
    const slug = generateSlug(data.title + "-" + Date.now())

    const newArticle = await db
      .insert(articles)
      .values({
        id,
        slug,
        title: data.title,
        content: data.content,
        description: data.description,
        authorId: data.authorId,
        coverImageUrl: data.coverImageUrl,
        coverImageAttribution: data.coverImageAttribution,
        heroImage: data.heroImage,
        heroImageAttribution: data.heroImageAttribution,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        status: data.status || "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    if (data.topicIds && data.topicIds.length > 0) {
      const articleTopicRelations = data.topicIds.map((topicId) => ({
        articleId: id,
        topicId,
      }))
      await db.insert(articleTopics).values(articleTopicRelations)
    }

    return { success: true, article: newArticle[0] }
  } catch (error) {
    console.error("Error creating article:", error)
    return { success: false, error: "Failed to create article" }
  }
}

// Get all articles
export async function getArticles({
  limit = 10,
  offset = 0,
  status,
  query,
  authorId,
}: {
  limit?: number
  offset?: number
  status?: ArticleStatus
  query?: string
  authorId?: string
}) {
  try {
    const whereClause = and(
      status ? eq(articles.status, status) : undefined,
      query
        ? or(
          like(articles.title, `%${query}%`),
          like(articles.description, `%${query}%`)
        )
        : undefined,
      authorId ? eq(articles.authorId, authorId) : undefined
    )

    const result = await db
      .select()
      .from(articles)
      .where(whereClause)
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset)

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(whereClause)

    const count = countResult[0].count

    return {
      articles: result,
      total: count,
      hasMore: offset + limit < count,
    }
  } catch (error) {
    console.error("Error fetching articles:", error)
    return { articles: [], total: 0, hasMore: false }
  }
}

// Update an article
export async function updateArticle(id: string, data: UpdateArticleData) {
  try {
    const updateData: Partial<UpdateArticleData & { updatedAt: Date }> = {
      updatedAt: new Date(),
    }

    if (data.title) updateData.title = data.title
    if (data.content) updateData.content = data.content
    if (data.description) updateData.description = data.description
    if (data.coverImageUrl !== undefined) updateData.coverImageUrl = data.coverImageUrl
    if (data.coverImageAttribution !== undefined) updateData.coverImageAttribution = data.coverImageAttribution
    if (data.heroImage !== undefined) updateData.heroImage = data.heroImage
    if (data.heroImageAttribution !== undefined) updateData.heroImageAttribution = data.heroImageAttribution
    if (data.metaTitle) updateData.metaTitle = data.metaTitle
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription
    if (data.status) updateData.status = data.status
    if (data.topicIds !== undefined) {
      // Handle topic updates: delete existing and insert new ones
      await db.delete(articleTopics).where(eq(articleTopics.articleId, id))
      if (data.topicIds.length > 0) {
        const newArticleTopicRelations = data.topicIds.map((topicId) => ({
          articleId: id,
          topicId,
        }))
        await db.insert(articleTopics).values(newArticleTopicRelations)
      }
    }

    const updatedArticle = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning()

    return { success: true, article: updatedArticle[0] }
  } catch (error) {
    console.error("Error updating article:", error)
    return { success: false, error: "Failed to update article" }
  }
}

// Delete an article
export async function deleteArticle(id: string) {
  try {
    const deletedArticle = await db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning()

    return { success: true, article: deletedArticle[0] }
  } catch (error) {
    console.error("Error deleting article:", error)
    return { success: false, error: "Failed to delete article" }
  }
}

// Get article by ID or slug
export async function getArticleByIdOrSlug(identifier: string) {
  try {
    const article = await db
      .select()
      .from(articles)
      .where(or(eq(articles.id, identifier), eq(articles.slug, identifier)))
      .limit(1)

    return article[0] || null
  } catch (error) {
    console.error("Error getting article by ID or slug:", error)
    return null
  }
}

// Get article stats (for analytics)
export async function getArticleStats() {
  try {
    const totalArticles = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)

    const publishedArticles = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(eq(articles.status, "published"))

    // Placeholder for views - implement actual view tracking if needed
    const totalViews = 0 // This would come from a separate view tracking mechanism

    return {
      totalArticles: totalArticles[0].count,
      publishedArticles: publishedArticles[0].count,
      totalViews,
    }
  } catch (error) {
    console.error("Error getting article stats:", error)
    return {
      totalArticles: 0,
      publishedArticles: 0,
      totalViews: 0,
    }
  }
}