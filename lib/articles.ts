import { db } from "@/lib/db"
import { articles, users, articleTopics } from "@/lib/schema"
import { eq, desc, and, or, like, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

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

    // Insert the article
    const [article] = await db
      .insert(articles)
      .values({
        id,
        title: data.title,
        slug,
        content: data.content, // Store MDX content directly
        description: data.description,
        status: data.status || "draft",
        authorId: data.authorId,
        coverImageUrl: data.coverImageUrl,
        coverImageAttribution: data.coverImageAttribution,
        heroImage: data.heroImage,
        heroImageAttribution: data.heroImageAttribution,
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription,
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .returning()

    // Add topic associations if provided
    if (data.topicIds && data.topicIds.length > 0) {
      await db.insert(articleTopics).values(
        data.topicIds.map((topicId) => ({
          articleId: id,
          topicId,
        })),
      )
    }

    return { success: true, article }
  } catch (error) {
    console.error("Error creating article:", error)
    return { success: false, error: "Failed to create article" }
  }
}

// Get article by ID with author and topics
export async function getArticleById(id: string) {
  try {
    const article = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        content: articles.content,
        description: articles.description,
        status: articles.status,
        coverImageUrl: articles.coverImageUrl,
        coverImageAttribution: articles.coverImageAttribution,
        heroImage: articles.heroImage,
        heroImageAttribution: articles.heroImageAttribution,
        metaTitle: articles.metaTitle,
        metaDescription: articles.metaDescription,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        publishedAt: articles.publishedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.id, id))
      .limit(1)

    return article[0] || null
  } catch (error) {
    console.error("Error fetching article:", error)
    return null
  }
}

// Get article by slug with author and topics
export async function getArticleBySlug(slug: string) {
  try {
    const article = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        content: articles.content,
        description: articles.description,
        status: articles.status,
        coverImageUrl: articles.coverImageUrl,
        coverImageAttribution: articles.coverImageAttribution,
        heroImage: articles.heroImage,
        heroImageAttribution: articles.heroImageAttribution,
        metaTitle: articles.metaTitle,
        metaDescription: articles.metaDescription,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        publishedAt: articles.publishedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.slug, slug))
      .limit(1)

    return article[0] || null
  } catch (error) {
    console.error("Error fetching article:", error)
    return null
  }
}

// Get all articles with pagination and filtering
export async function getArticles(
  options: {
    status?: ArticleStatus
    authorId?: string
    search?: string
    limit?: number
    offset?: number
  } = {},
) {
  try {
    const { status, authorId, search, limit = 10, offset = 0 } = options

    // Build the base query
    const baseQuery = db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        content: articles.content,
        description: articles.description,
        status: articles.status,
        coverImageUrl: articles.coverImageUrl,
        coverImageAttribution: articles.coverImageAttribution,
        heroImage: articles.heroImage,
        heroImageAttribution: articles.heroImageAttribution,
        metaDescription: articles.metaDescription,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        publishedAt: articles.publishedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))

    // Apply filters
    const conditions = []
    if (status) conditions.push(eq(articles.status, status))
    if (authorId) conditions.push(eq(articles.authorId, authorId))
    if (search) {
      conditions.push(or(like(articles.title, `%${search}%`), like(articles.content, `%${search}%`)))
    }

    // Apply where clause if conditions exist
    const result = await (() => {
      if (conditions.length > 0) {
        return baseQuery
          .where(and(...conditions))
          .orderBy(desc(articles.createdAt))
          .limit(limit)
          .offset(offset)
      } else {
        return baseQuery
          .orderBy(desc(articles.createdAt))
          .limit(limit)
          .offset(offset)
      }
    })()

    // Get total count for pagination
    let countResult
    if (conditions.length > 0) {
      countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(articles)
        .where(and(...conditions))
    } else {
      countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(articles)
    }

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
    const updateData: any = {
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

    if (data.status) {
      updateData.status = data.status
      if (data.status === "published") {
        updateData.publishedAt = new Date()
      }
    }

    // Update slug if title changed
    if (data.title) {
      updateData.slug = generateSlug(data.title + "-" + Date.now())
    }

    const [article] = await db.update(articles).set(updateData).where(eq(articles.id, id)).returning()

    // Update topic associations if provided
    if (data.topicIds !== undefined) {
      // Remove existing associations
      await db.delete(articleTopics).where(eq(articleTopics.articleId, id))

      // Add new associations
      if (data.topicIds.length > 0) {
        await db.insert(articleTopics).values(
          data.topicIds.map((topicId) => ({
            articleId: id,
            topicId,
          })),
        )
      }
    }

    return { success: true, article }
  } catch (error) {
    console.error("Error updating article:", error)
    return { success: false, error: "Failed to update article" }
  }
}

// Delete an article
export async function deleteArticle(id: string) {
  try {
    // Delete topic associations first (cascade should handle this, but being explicit)
    await db.delete(articleTopics).where(eq(articleTopics.articleId, id))

    // Delete the article
    await db.delete(articles).where(eq(articles.id, id))

    return { success: true }
  } catch (error) {
    console.error("Error deleting article:", error)
    return { success: false, error: "Failed to delete article" }
  }
}

// Publish an article (change status from draft to published)
export async function publishArticle(id: string) {
  return updateArticle(id, {
    status: "published",
  })
}

// Archive an article
export async function archiveArticle(id: string) {
  return updateArticle(id, {
    status: "archived",
  })
}

// Get articles by status with counts
export async function getArticleStats() {
  try {
    const stats = await db
      .select({
        status: articles.status,
        count: sql<number>`count(*)`,
      })
      .from(articles)
      .groupBy(articles.status)

    const result = {
      draft: 0,
      published: 0,
      archived: 0,
    }

    stats.forEach((stat) => {
      result[stat.status] = stat.count
    })

    return result
  } catch (error) {
    console.error("Error fetching article stats:", error)
    return { draft: 0, published: 0, archived: 0 }
  }
}
