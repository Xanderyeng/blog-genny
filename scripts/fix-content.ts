/**
 * Utility script to fix malformed MDX content in existing articles
 * This addresses the specific issue with incomplete code blocks that cause MDX parsing errors
 */

import { db } from "@/lib/db"
import { articles } from "@/lib/schema"
import { eq } from "drizzle-orm"

function fixMalformedContent(content: string): string {
    if (!content) return ""
    
    let fixed = content
        // Ensure proper line endings
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
    
    // Fix the specific issue from the error - incomplete code blocks
    // Look for lines that start a code block but don't have a closing block
    const lines = fixed.split('\n')
    const fixedLines: string[] = []
    let insideCodeBlock = false
    let codeBlockLang = ''
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        
        // Check if this line starts a code block
        const codeBlockMatch = line.match(/^```(\w+)?/)
        if (codeBlockMatch && !insideCodeBlock) {
            insideCodeBlock = true
            codeBlockLang = codeBlockMatch[1] || ''
            fixedLines.push(line)
            continue
        }
        
        // Check if this line ends a code block
        if (line.trim() === '```' && insideCodeBlock) {
            insideCodeBlock = false
            fixedLines.push(line)
            continue
        }
        
        fixedLines.push(line)
    }
    
    // If we ended while still inside a code block, close it
    if (insideCodeBlock) {
        fixedLines.push('```')
    }
    
    fixed = fixedLines.join('\n')
    
    // Additional cleanup for MDX compatibility
    const processedLines = fixed.split('\n').map((line, index) => {
        // Skip lines that are inside code blocks
        const beforeLine = fixedLines.slice(0, index).join('\n')
        const codeBlockCount = (beforeLine.match(/```/g) || []).length
        const currentlyInsideCodeBlock = codeBlockCount % 2 === 1
        
        if (currentlyInsideCodeBlock) {
            return line // Don't modify lines inside code blocks
        }
        
        // For lines outside code blocks, escape problematic characters
        return line
            .replace(/\{(?![^}]*\})/g, "\\{")
            .replace(/(?<!\{[^{]*)\}(?![^}]*\})/g, "\\}")
            .replace(/\$\{/g, "\\${")
    })
    
    return processedLines.join('\n').trim()
}

export async function fixArticleContent(articleId: string) {
    try {
        // Get the article
        const article = await db
            .select()
            .from(articles)
            .where(eq(articles.id, articleId))
            .limit(1)
        
        if (!article[0]) {
            throw new Error("Article not found")
        }
        
        const originalContent = article[0].content
        const fixedContent = fixMalformedContent(originalContent)
        
        // Only update if content actually changed
        if (fixedContent !== originalContent) {
            await db
                .update(articles)
                .set({ 
                    content: fixedContent,
                    updatedAt: new Date()
                })
                .where(eq(articles.id, articleId))
            
            console.log(`Fixed content for article: ${article[0].title}`)
            return { success: true, changed: true }
        }
        
        return { success: true, changed: false }
    } catch (error) {
        console.error("Error fixing article content:", error)
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
}

export async function fixAllArticles() {
    try {
        // Get all articles
        const allArticles = await db.select().from(articles)
        
        let fixedCount = 0
        let errorCount = 0
        
        for (const article of allArticles) {
            const result = await fixArticleContent(article.id)
            if (result.success && result.changed) {
                fixedCount++
            } else if (!result.success) {
                errorCount++
                console.error(`Failed to fix article ${article.id}:`, result.error)
            }
        }
        
        console.log(`Fixed ${fixedCount} articles, ${errorCount} errors`)
        return { fixedCount, errorCount }
    } catch (error) {
        console.error("Error fixing all articles:", error)
        return { fixedCount: 0, errorCount: 1 }
    }
}

// If running this script directly
if (require.main === module) {
    fixAllArticles().then((result) => {
        console.log("Fix complete:", result)
        process.exit(0)
    }).catch((error) => {
        console.error("Fix failed:", error)
        process.exit(1)
    })
}
