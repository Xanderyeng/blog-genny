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

Format your response as JSON with this structure:
{
  "title": "Your compelling blog post title",
  "description": "Brief 2-3 sentence description of the post",
  "content": "The full blog post content in markdown format",
  "tags": ["tag1", "tag2", "tag3"]
}

Make sure the JSON is valid and properly escaped.`;

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

        // Find hero image for the article
        const heroImageData = await findHeroImage(articleData.title);

        // Create the article in the database
        const articleResult = await createArticle({
            title: articleData.title,
            content: articleData.content,
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
