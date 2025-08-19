"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { findHeroImage } from "@/lib/images";
import { createArticle } from "@/lib/articles";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface GenerateBlogResult {
    success: boolean;
    articleId?: string;
    slug?: string;
    error?: string;
}

export async function generateBlog(topic: string): Promise<GenerateBlogResult> {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return {
                success: false,
                error: "You must be logged in to generate blog posts."
            };
        }

        if (!process.env.GEMINI_API_KEY) {
            return {
                success: false,
                error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables."
            };
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Get current date and time
        const currentDate = new Date().toISOString();

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
- ALL code blocks MUST be properly formatted with opening ``` and closing ``` on separate lines
- Always specify language for code blocks (e.g., \`\`\`python, \`\`\`javascript)
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

CRITICAL: Make sure the JSON is valid and properly escaped. Use only standard markdown syntax in the content field. All code blocks must have both opening and closing backticks.`;

        const result = await model.generateContent(prompt);
        let generatedResponse = result.response.text();

        // Clean up the response to ensure it's valid JSON
        generatedResponse = generatedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse the JSON response
        let articleData;
        try {
            articleData = JSON.parse(generatedResponse);
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", parseError);
            console.error("Raw response:", generatedResponse);
            return {
                success: false,
                error: "Failed to parse AI response. Please try again."
            };
        }

        // Validate required fields
        if (!articleData.title || !articleData.content || !articleData.description) {
            return {
                success: false,
                error: "AI response missing required fields (title, content, or description)."
            };
        }

        // Sanitize the content to prevent MDX parsing issues
        let sanitizedContent = articleData.content
            // Ensure proper line endings
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            
        // Fix malformed code blocks - ensure all code blocks are properly closed
        const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)(?=\n```|\n\n|$)/g
        sanitizedContent = sanitizedContent.replace(codeBlockRegex, (match, lang, code) => {
            const cleanLang = lang || ""
            const cleanCode = code.trim()
            // Ensure the code block is properly closed
            if (!match.includes('\n```')) {
                return `\`\`\`${cleanLang}\n${cleanCode}\n\`\`\``
            }
            return match
        })
        
        // Handle incomplete code blocks at the end of content
        if (sanitizedContent.includes('```') && !sanitizedContent.trim().endsWith('```')) {
            const lastCodeBlockIndex = sanitizedContent.lastIndexOf('```')
            const afterLastBlock = sanitizedContent.substring(lastCodeBlockIndex + 3)
            if (!afterLastBlock.includes('```')) {
                sanitizedContent += '\n```'
            }
        }
        
        // More aggressive brace handling for content outside code blocks
        const lines = sanitizedContent.split('\n')
        let insideCodeBlock = false
        const processedLines = lines.map(line => {
            if (line.trim().startsWith('```')) {
                insideCodeBlock = !insideCodeBlock
                return line
            }
            
            if (insideCodeBlock) {
                return line // Don't modify lines inside code blocks
            }
            
            // For lines outside code blocks, aggressively escape problematic characters
            return line
                .replace(/\{/g, "\\{")
                .replace(/\}/g, "\\}")
                .replace(/\$\\?\{/g, "\\${")
                .replace(/`(?!`)/g, "\\`") // Escape single backticks
        })
        
        sanitizedContent = processedLines.join('\n')
            // Ensure proper spacing around headings
            .replace(/^(#{1,6})\s*(.+)$/gm, '$1 $2')
            // Fix any template literal issues
            .replace(/\$\{([^}]*)\}/g, '\\${$1\\}')
            // Clean up any double escaping
            .replace(/\\\\(\{|\})/g, '\\$1')
            .trim()

        // Find hero image for the article
        const heroImageData = await findHeroImage(articleData.title);

        // Create the article in the database
        const articleResult = await createArticle({
            title: articleData.title,
            content: sanitizedContent,
            description: articleData.description,
            authorId: session.user.id,
            coverImageUrl: heroImageData?.imageUrl,
            coverImageAttribution: heroImageData?.attribution,
            metaTitle: articleData.title,
            metaDescription: articleData.description,
            status: "draft", // Always create as draft for review
            // Note: We'll handle tags later when we implement the topics system
        });

        if (!articleResult.success) {
            return {
                success: false,
                error: articleResult.error || "Failed to save article to database."
            };
        }

        return {
            success: true,
            articleId: articleResult.article?.id,
            slug: articleResult.article?.slug
        };
    } catch (error) {
        console.error("Error generating blog:", error);

        let errorMessage = "An unexpected error occurred while generating the blog post.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}
