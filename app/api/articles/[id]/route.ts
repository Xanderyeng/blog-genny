import { NextRequest, NextResponse } from "next/server"
import { publishArticle, archiveArticle, deleteArticle, unpublishArticle, getArticleByIdOrSlug, updateArticle } from "@/lib/articles"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { users, articles } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

// Get article by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1)

        if (!user[0]) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Get article and verify ownership
       const article = await getArticleByIdOrSlug(id)

        // Add an additional check for article ownership if needed
        if (!article || article.authorId !== user[0].id) {
            return NextResponse.json({ error: "Article not found or not owned by user" }, { status: 404 })
        }

        return NextResponse.json(article)
    } catch (error) {
        console.error("Error getting article:", error)
        return NextResponse.json(
            { error: "Failed to get article" },
            { status: 500 }
        )
    }
}

// Update article status or content
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1)

        if (!user[0]) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Verify article ownership
        const existingArticle = await db
            .select()
            .from(articles)
            .where(
                and(
                    eq(articles.id, id),
                    eq(articles.authorId, user[0].id)
                )
            )
            .limit(1)

        if (!existingArticle[0]) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 })
        }

        const { action } = await request.json()

        let result
        if (action === "publish") {
            result = await publishArticle(id)
        } else if (action === "unpublish") {
            result = await unpublishArticle(id)
        } else if (action === "archive") {
            result = await archiveArticle(id)
        } else {
            return NextResponse.json(
                { error: "Invalid action. Use 'publish', 'unpublish', or 'archive'" },
                { status: 400 }
            )
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error updating article:", error)
        return NextResponse.json(
            { error: "Failed to update article" },
            { status: 500 }
        )
    }
}

// Update article content
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1)

        if (!user[0]) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Verify article ownership
        const existingArticle = await db
            .select()
            .from(articles)
            .where(
                and(
                    eq(articles.id, id),
                    eq(articles.authorId, user[0].id)
                )
            )
            .limit(1)

        if (!existingArticle[0]) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 })
        }

        const updateData = await request.json()
        const result = await updateArticle(id, updateData)

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error updating article content:", error)
        return NextResponse.json(
            { error: "Failed to update article" },
            { status: 500 }
        )
    }
}

// Delete article
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1)

        if (!user[0]) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Verify article ownership
        const existingArticle = await db
            .select()
            .from(articles)
            .where(
                and(
                    eq(articles.id, id),
                    eq(articles.authorId, user[0].id)
                )
            )
            .limit(1)

        if (!existingArticle[0]) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 })
        }

        const result = await deleteArticle(id)
        return NextResponse.json(result)
    } catch (error) {
        console.error("Error deleting article:", error)
        return NextResponse.json(
            { error: "Failed to delete article" },
            { status: 500 }
        )
    }
}
