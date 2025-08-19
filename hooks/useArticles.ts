import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Types
interface Article {
    id: string
    title: string
    slug: string
    status: "draft" | "published" | "archived"
    createdAt: Date
    updatedAt: Date
    publishedAt: Date | null
    author: {
        id: string
        name: string | null
        email: string
    } | null
}

interface ArticleStats {
    draft: number
    published: number
    archived: number
}

interface ArticlesResponse {
    articles: Article[]
    pagination: {
        page: number
        limit: number
        total: number
    }
}

// API functions
async function fetchArticles(limit?: number): Promise<ArticlesResponse> {
    const url = limit ? `/api/articles?limit=${limit}` : "/api/articles"
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Failed to fetch articles")
    }
    return response.json()
}

async function fetchArticleStats(): Promise<ArticleStats> {
    const response = await fetch("/api/articles/stats")
    if (!response.ok) {
        throw new Error("Failed to fetch article stats")
    }
    return response.json()
}

async function updateArticleStatus(id: string, action: "publish" | "archive") {
    const response = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
    })
    if (!response.ok) {
        throw new Error(`Failed to ${action} article`)
    }
    return response.json()
}

async function deleteArticle(id: string) {
    const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
    })
    if (!response.ok) {
        throw new Error("Failed to delete article")
    }
    return response.json()
}

// Query keys
export const articleKeys = {
    all: ["articles"] as const,
    lists: () => [...articleKeys.all, "list"] as const,
    list: (limit?: number) => [...articleKeys.lists(), { limit }] as const,
    stats: () => [...articleKeys.all, "stats"] as const,
}

// Hooks
export function useArticles(limit?: number) {
    return useQuery({
        queryKey: articleKeys.list(limit),
        queryFn: () => fetchArticles(limit),
        staleTime: 30 * 1000, // 30 seconds
    })
}

export function useArticleStats() {
    return useQuery({
        queryKey: articleKeys.stats(),
        queryFn: fetchArticleStats,
        staleTime: 30 * 1000, // 30 seconds
    })
}

export function usePublishArticle() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => updateArticleStatus(id, "publish"),
        onMutate: async (id: string) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: articleKeys.all })

            // Snapshot the previous value
            const previousArticles = queryClient.getQueryData(articleKeys.list())
            const previousStats = queryClient.getQueryData(articleKeys.stats())

            // Optimistically update the article
            queryClient.setQueryData(articleKeys.list(), (old: ArticlesResponse | undefined) => {
                if (!old) return old
                return {
                    ...old,
                    articles: old.articles.map(article =>
                        article.id === id
                            ? { ...article, status: "published" as const, publishedAt: new Date() }
                            : article
                    )
                }
            })

            // Optimistically update the stats
            queryClient.setQueryData(articleKeys.stats(), (old: ArticleStats | undefined) => {
                if (!old) return old
                return {
                    ...old,
                    draft: old.draft - 1,
                    published: old.published + 1
                }
            })

            return { previousArticles, previousStats }
        },
        onError: (err, id, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousArticles) {
                queryClient.setQueryData(articleKeys.list(), context.previousArticles)
            }
            if (context?.previousStats) {
                queryClient.setQueryData(articleKeys.stats(), context.previousStats)
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: articleKeys.all })
        },
    })
}

export function useArchiveArticle() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => updateArticleStatus(id, "archive"),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: articleKeys.all })

            const previousArticles = queryClient.getQueryData(articleKeys.list())
            const previousStats = queryClient.getQueryData(articleKeys.stats())

            // Get the current article to know its current status
            const currentData = queryClient.getQueryData(articleKeys.list()) as ArticlesResponse | undefined
            const currentArticle = currentData?.articles.find(a => a.id === id)

            // Optimistically update the article
            queryClient.setQueryData(articleKeys.list(), (old: ArticlesResponse | undefined) => {
                if (!old) return old
                return {
                    ...old,
                    articles: old.articles.map(article =>
                        article.id === id
                            ? { ...article, status: "archived" as const }
                            : article
                    )
                }
            })

            // Optimistically update the stats
            if (currentArticle) {
                queryClient.setQueryData(articleKeys.stats(), (old: ArticleStats | undefined) => {
                    if (!old) return old
                    return {
                        ...old,
                        [currentArticle.status]: old[currentArticle.status] - 1,
                        archived: old.archived + 1
                    }
                })
            }

            return { previousArticles, previousStats }
        },
        onError: (err, id, context) => {
            if (context?.previousArticles) {
                queryClient.setQueryData(articleKeys.list(), context.previousArticles)
            }
            if (context?.previousStats) {
                queryClient.setQueryData(articleKeys.stats(), context.previousStats)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: articleKeys.all })
        },
    })
}

export function useDeleteArticle() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteArticle,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: articleKeys.all })

            const previousArticles = queryClient.getQueryData(articleKeys.list())
            const previousStats = queryClient.getQueryData(articleKeys.stats())

            // Get the current article to know its status
            const currentData = queryClient.getQueryData(articleKeys.list()) as ArticlesResponse | undefined
            const currentArticle = currentData?.articles.find(a => a.id === id)

            // Optimistically remove the article
            queryClient.setQueryData(articleKeys.list(), (old: ArticlesResponse | undefined) => {
                if (!old) return old
                return {
                    ...old,
                    articles: old.articles.filter(article => article.id !== id)
                }
            })

            // Optimistically update the stats
            if (currentArticle) {
                queryClient.setQueryData(articleKeys.stats(), (old: ArticleStats | undefined) => {
                    if (!old) return old
                    return {
                        ...old,
                        [currentArticle.status]: old[currentArticle.status] - 1
                    }
                })
            }

            return { previousArticles, previousStats }
        },
        onError: (err, id, context) => {
            if (context?.previousArticles) {
                queryClient.setQueryData(articleKeys.list(), context.previousArticles)
            }
            if (context?.previousStats) {
                queryClient.setQueryData(articleKeys.stats(), context.previousStats)
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: articleKeys.all })
        },
    })
}
