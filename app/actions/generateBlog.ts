"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

interface GenerateBlogResult {
    success: boolean;
    slug?: string;
    error?: string;
}

export async function generateBlog(topic: string): Promise<GenerateBlogResult> {
    try {
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
- Start with frontmatter (title, description, date, tags)
- Use clear headings with ## and ###
- Include bullet points and useful examples
- Length: 600-800 words
- Make it engaging and informative
- Include relevant tags (3-5 tags)

Format the response as valid MDX with frontmatter like this:
---
title: "Your Blog Post Title"
description: "Brief description of the post"
date: "CURRENT_DATE_PLACEHOLDER"
tags: ["tag1", "tag2", "tag3"]
---

# Your Blog Post Title

Your content here...`;

        const result = await model.generateContent(prompt);
        let generatedContent = result.response.text();

        // Replace the placeholder with the actual current date
        generatedContent = generatedContent.replace(
            '"CURRENT_DATE_PLACEHOLDER"',
            `"${currentDate}"`
        );

        // Also handle cases where AI might generate a different date format
        // Replace any date in YYYY-MM-DD format with our current date
        generatedContent = generatedContent.replace(
            /date:\s*"[\d]{4}-[\d]{2}-[\d]{2}"/g,
            `date: "${currentDate}"`
        );

        // Also handle dates without quotes
        generatedContent = generatedContent.replace(
            /date:\s*[\d]{4}-[\d]{2}-[\d]{2}/g,
            `date: "${currentDate}"`
        );

        // Generate a slug from the topic
        const slug = topic
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            .substring(0, 50)
            .replace(/-$/, '');

        // Add timestamp to make slug unique
        const timestamp = Date.now();
        const uniqueSlug = `${slug}-${timestamp}`;

        // Ensure content directory exists
        const contentDir = path.join(process.cwd(), "content", "blog");
        if (!fs.existsSync(contentDir)) {
            fs.mkdirSync(contentDir, { recursive: true });
        }

        // Save the generated content as an MDX file
        const filePath = path.join(contentDir, `${uniqueSlug}.mdx`);
        fs.writeFileSync(filePath, generatedContent, "utf8");

        return {
            success: true,
            slug: uniqueSlug
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
