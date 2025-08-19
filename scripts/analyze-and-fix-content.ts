import { db } from "@/lib/db"
import { articles } from "@/lib/schema"
import { eq } from "drizzle-orm"

function aggressiveContentSanitization(content: string): string {
    if (!content) return ""
    
    let sanitized = content
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
    
    // Fix incomplete code blocks
    const lines = sanitized.split('\n')
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
    
    // Aggressively escape ALL problematic characters outside code blocks
    let processedContent = fixedLines.join('\n')
    const processedLines = processedContent.split('\n').map((line, index) => {
        const beforeLine = fixedLines.slice(0, index).join('\n')
        const codeBlockCount = (beforeLine.match(/```/g) || []).length
        const currentlyInsideCodeBlock = codeBlockCount % 2 === 1
        
        if (currentlyInsideCodeBlock) {
            return line
        }
        
        // Escape EVERYTHING that could cause issues
        return line
            .replace(/\{/g, "\\{")
            .replace(/\}/g, "\\}")
            .replace(/\$/g, "\\$")
            .replace(/`(?!`)/g, "\\`")
            .replace(/\[(?!\])/g, "\\[")
            .replace(/(?<!\[)\]/g, "\\]")
    })
    
    return processedLines.join('\n')
        .replace(/^(#{1,6})\s*(.+)$/gm, '$1 $2')
        .trim()
}

async function analyzeAndFixAllArticles() {
    try {
        console.log("🔍 Analyzing all articles for MDX issues...")
        
        const allArticles = await db.select().from(articles)
        console.log(`Found ${allArticles.length} articles to analyze`)
        
        let fixedCount = 0
        let errorCount = 0
        const problematicArticles: Array<{id: string, title: string, issues: string[]}> = []
        
        for (const article of allArticles) {
            const issues: string[] = []
            
            // Check for common problematic patterns
            const content = article.content || ""
            
            // Check for unescaped braces
            const unescapedBraces = content.match(/[^\\]\{|[^\\]\}/g)
            if (unescapedBraces) {
                issues.push(`Unescaped braces: ${unescapedBraces.length} instances`)
            }
            
            // Check for incomplete code blocks
            const codeBlockMatches = (content.match(/```/g) || []).length
            if (codeBlockMatches % 2 !== 0) {
                issues.push("Incomplete code block")
            }
            
            // Check for template literals
            const templateLiterals = content.match(/\$\{[^}]*\}/g)
            if (templateLiterals) {
                issues.push(`Template literals: ${templateLiterals.length} instances`)
            }
            
            // Check for single backticks (potential parsing issues)
            const singleBackticks = content.match(/(?<!`)`(?!`)/g)
            if (singleBackticks) {
                issues.push(`Single backticks: ${singleBackticks.length} instances`)
            }
            
            if (issues.length > 0) {
                problematicArticles.push({
                    id: article.id,
                    title: article.title || "Untitled",
                    issues
                })
                
                console.log(`⚠️  ${article.title}: ${issues.join(", ")}`)
                
                // Try to fix the content
                try {
                    const originalContent = article.content || ""
                    const fixedContent = aggressiveContentSanitization(originalContent)
                    
                    if (fixedContent !== originalContent) {
                        await db
                            .update(articles)
                            .set({
                                content: fixedContent,
                                updatedAt: new Date()
                            })
                            .where(eq(articles.id, article.id))
                        
                        fixedCount++
                        console.log(`✅ Fixed: ${article.title}`)
                    }
                } catch (error) {
                    errorCount++
                    console.error(`❌ Failed to fix ${article.title}:`, error)
                }
            }
        }
        
        console.log("\n📊 Analysis Complete:")
        console.log(`Total articles: ${allArticles.length}`)
        console.log(`Problematic articles: ${problematicArticles.length}`)
        console.log(`Successfully fixed: ${fixedCount}`)
        console.log(`Errors: ${errorCount}`)
        
        if (problematicArticles.length > 0) {
            console.log("\n📝 Detailed Issues:")
            problematicArticles.forEach(article => {
                console.log(`- ${article.title} (${article.id}): ${article.issues.join(", ")}`)
            })
        }
        
        return {
            total: allArticles.length,
            problematic: problematicArticles.length,
            fixed: fixedCount,
            errors: errorCount,
            issues: problematicArticles
        }
        
    } catch (error) {
        console.error("❌ Analysis failed:", error)
        throw error
    }
}

// Run if called directly
if (require.main === module) {
    analyzeAndFixAllArticles()
        .then(result => {
            console.log("\n🎉 Analysis and fix complete!")
            process.exit(0)
        })
        .catch(error => {
            console.error("\n💥 Analysis failed:", error)
            process.exit(1)
        })
}

export { analyzeAndFixAllArticles, aggressiveContentSanitization }
