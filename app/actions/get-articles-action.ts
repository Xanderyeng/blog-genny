"use server"

import { getArticles, getArticleStats, publishArticle, archiveArticle, deleteArticle } from "@/lib/articles"

export async function getArticleStatsAction() {
  try {
    const result = await getArticleStats()
    return { success: true, data: result }
  } catch (error) {
    console.error("Error fetching article stats:", error)
    return { success: false, error: "Failed to fetch article stats" }
  }
}

export async function publishArticleAction(id: string) {
  try {
    const result = await publishArticle(id)
    return { success: true, data: result }
  } catch (error) {
    console.error("Error publishing article:", error)
    return { success: false, error: "Failed to publish article" }
  }
}

export async function archiveArticleAction(id: string) {
  try {
    const result = await archiveArticle(id)
    return { success: true, data: result }
  } catch (error) {
    console.error("Error archiving article:", error)
    return { success: false, error: "Failed to archive article" }
  }
}

export async function deleteArticleAction(id: string) {
  try {
    const result = await deleteArticle(id)
    return { success: true, data: result }
  } catch (error) {
    console.error("Error deleting article:", error)
    return { success: false, error: "Failed to delete article" }
  }
}
