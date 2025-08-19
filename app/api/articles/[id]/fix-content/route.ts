import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { articles, users } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

function fixMalformedContent(content: string): string {
    if (!content) return ""
    
    let fixed = content
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
    
    // Fix incomplete code blocks
    const lines = fixed.split('\n')
    const fixedLines: string[] = []
    let insideCodeBlock = false
    
    for (const line of lines) {
        const codeBlockMatch = line.match(/^```(\w+)?/)
        if (codeBlockMatch && !insideCodeBlock) {
            insideCodeBlock = true
            fixedLines.push(line)
            continue
        }
        
        if (line.trim() === '```' && insideCodeBlock) {
            insideCodeBlock = false
            fixedLines.push(line)
            continue
        }
        
        fixedLines.push(line)
    }
    
    // Close any unclosed code blocks
    if (insideCodeBlock) {
        fixedLines.push('```')
    }
    
    // More aggressive brace handling
    let processedContent = fixedLines.join('\n')
    const processedLines = processedContent.split('\n').map((line, index) => {
        const beforeLine = fixedLines.slice(0, index).join('\n')
        const codeBlockCount = (beforeLine.match(/```/g) || []).length
        const currentlyInsideCodeBlock = codeBlockCount % 2 === 1
        
        if (currentlyInsideCodeBlock) {
            return line
        }
        
        // Aggressively escape all problematic characters outside code blocks
        return line
            .replace(/\{/g, "\\{")
            .replace(/\}/g, "\\}")
            .replace(/\$\\?\{/g, "\\${")
            .replace(/`(?!`)/g, "\\`")
    })
    
    return processedLines.join('\n')
        .replace(/^(#{1,6})\s*(.+)$/gm, '$1 $2')
        .replace(/\$\{([^}]*)\}/g, '\\${$1\\}')
        .replace(/\\\\(\{|\})/g, '\\$1')
        .trim()
}

export async function POST(
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

        // Get and verify article ownership
        const article = await db
            .select()
            .from(articles)
            .where(
                and(
                    eq(articles.id, id),
                    eq(articles.authorId, user[0].id)
                )
            )
            .limit(1)

        if (!article[0]) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 })
        }

        const originalContent = article[0].content
        const fixedContent = fixMalformedContent(originalContent)
        
        // Update the article with fixed content
        const updatedArticle = await db
            .update(articles)
            .set({ 
                content: fixedContent,
                updatedAt: new Date()
            })
            .where(eq(articles.id, id))
            .returning()

        return NextResponse.json({
            success: true,
            changed: fixedContent !== originalContent,
            article: updatedArticle[0]
        })
    } catch (error) {
        console.error("Error fixing article content:", error)
        return NextResponse.json(
            { error: "Failed to fix article content" },
            { status: 500 }
        )
    }
}
