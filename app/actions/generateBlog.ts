"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { findHeroImage } from "@/lib/images"
import { createArticle } from "@/lib/articles"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db" // ✅ 
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"

interface GenerateBlogResult {
  success: boolean
  articleId?: string
  slug?: string
  error?: string
}

export async function generateBlog(topic: string): Promise<GenerateBlogResult> {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return {
        success: false,
        error: "You must be logged in to generate blog posts.",
      }
    }
// ✅ Step 1: Find the user in the database using their email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))

    // ✅ Step 2: Ensure the user exists in your database
    if (!user) {
      return { success: false, error: "User not found in the database." }
    }

    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables.",
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Get current date and time
    const currentDate = new Date().toISOString()

    const prompt = `Write a detailed, SEO-friendly blog post about: ${topic}.

Requirements:
- Write ONLY the main content, no frontmatter
- Use clear headings with ## and ###
- Include bullet points and useful examples
- Length: 600-800 words
- Make it engaging and informative
- Write a compelling title
- Include a brief description (2-3 sentences)
- Use standard markdown syntax only (no JSX or complex expressions)
- ALL code blocks MUST be properly formatted with opening \`\`\` and closing \`\`\` on separate lines
- Always specify language for code blocks (e.g., \`\`\` python, \`\`\`javascript)
- Never use incomplete or malformed code blocks
- Avoid using curly braces {} except in properly formatted and complete code blocks
- Ensure proper paragraph spacing and formatting

Format your response as JSON with this structure:
{
  "title": "Your compelling blog post title",
  "description": "Brief 2-3 sentence description of the post",
  "content": "The full blog post content in markdown format with proper code blocks",
  "tags": ["tag1", "tag2", "tag3"]
}

CRITICAL: Make sure the JSON is valid and properly escaped. Use only standard markdown syntax in the content field. All code blocks must have both opening and closing backticks.`

    const result = await model.generateContent(prompt)
    let generatedResponse = result.response.text()

    // Clean up the response to ensure it's valid JSON
    generatedResponse = generatedResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()

    // Parse the JSON response
    let articleData
    try {
      articleData = JSON.parse(generatedResponse)
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError)
      console.error("Raw response:", generatedResponse)
      return {
        success: false,
        error: "Failed to parse AI response. Please try again.",
      }
    }

    // Validate required fields
    if (!articleData.title || !articleData.content || !articleData.description) {
      return {
        success: false,
        error: "AI response missing required fields (title, content, or description).",
      }
    }

    let sanitizedContent = articleData.content
      // Normalize line endings
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")

    // Fix incomplete code blocks
    const codeBlockMatches = sanitizedContent.match(/```/g)
    if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
      // Odd number of backticks means incomplete code block
      sanitizedContent += "\n```"
    }

    // Process content line by line to handle escaping properly
    const lines = sanitizedContent.split("\n")
    let insideCodeBlock = false

    const processedLines = lines.map((line: string) => {
      // Track if we're entering/exiting a code block
      if (line.trim().startsWith("```")) {
        insideCodeBlock = !insideCodeBlock
        return line
      }

      // Don't modify content inside code blocks
      if (insideCodeBlock) {
        return line
      }

      // Escape problematic characters outside code blocks
      return line
        .replace(/\{/g, "\\{")
        .replace(/\}/g, "\\}")
        .replace(/`(?!``)/g, "\\`") // Escape single backticks but not triple backticks
    })

    sanitizedContent = processedLines
      .join("\n")
      // Ensure proper heading spacing
      .replace(/^(#{1,6})\s*(.+)$/gm, "$1 $2")
      .trim()

    // Find hero image for the article
    const heroImageData = await findHeroImage(articleData.title)

    // ✅ Step 3: Pass the correct database ID to createArticle
    // Create the article in the database
    const articleResult = await createArticle({
      title: articleData.title,
      content: sanitizedContent,
      description: articleData.description,
      authorId: user.id,
      coverImageUrl: heroImageData?.imageUrl,
      coverImageAttribution: heroImageData?.attribution,
      metaTitle: articleData.title,
      metaDescription: articleData.description,
      status: "draft", // Always create as draft for review
      // Note: We'll handle tags later when we implement the topics system
    })

    if (!articleResult.success) {
      return {
        success: false,
        error: articleResult.error || "Failed to save article to database.",
      }
    }

    return {
      success: true,
      articleId: articleResult.article?.id,
      slug: articleResult.article?.slug,
    }
  } catch (error) {
    console.error("Error generating blog:", error)

    let errorMessage = "An unexpected error occurred while generating the blog post."
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}
