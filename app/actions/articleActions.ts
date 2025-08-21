"use server"

import { getArticles, type ArticleStatus } from "@/lib/articles"

export async function getArticlesAction(options?: {
  limit?: number
  offset?: number
  status?: ArticleStatus
  query?: string
  authorId?: string
}) {
  try {
    const result = await getArticles(options || {})
    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching articles:", error)
    return { success: false, error: "Failed to fetch articles" }
  }
}
