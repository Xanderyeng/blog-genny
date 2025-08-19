import { NextRequest, NextResponse } from "next/server"
import { publishArticle, archiveArticle, deleteArticle } from "@/lib/articles"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { action } = await request.json()

        let result
        if (action === "publish") {
            result = await publishArticle(params.id)
        } else if (action === "archive") {
            result = await archiveArticle(params.id)
        } else {
            return NextResponse.json(
                { error: "Invalid action. Use 'publish' or 'archive'" },
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const result = await deleteArticle(params.id)
        return NextResponse.json(result)
    } catch (error) {
        console.error("Error deleting article:", error)
        return NextResponse.json(
            { error: "Failed to delete article" },
            { status: 500 }
        )
    }
}
