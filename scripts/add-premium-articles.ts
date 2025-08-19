import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { articles } from "../lib/schema.js";
import { config } from "dotenv";
import { nanoid } from "nanoid";

// Load environment variables
config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/blog_generator_dev";

async function addPremiumUserArticles() {
    const client = postgres(connectionString, { max: 1 });
    const db = drizzle(client);

    try {
        console.log("📝 Adding articles for premium test user...\n");

        const premiumUserId = 'premium-test-001';
        
        const testArticles = [
            {
                title: "My Premium Content Strategy",
                content: `# My Premium Content Strategy

As a premium user, I have access to unlimited article generation and advanced features. This allows me to create comprehensive content strategies without limitations.

## Key Benefits of Premium

- Unlimited article generation
- Advanced analytics
- Priority AI processing
- Custom branding options

## Content Planning

With premium access, I can plan my content calendar more effectively and generate articles on demand.`,
                description: "Exploring the benefits of premium content creation tools and strategies.",
                status: "published" as const
            },
            {
                title: "Advanced Analytics Deep Dive",
                content: `# Advanced Analytics Deep Dive

This article showcases the advanced analytics features available to premium users.

## Metrics That Matter

Premium users get access to detailed analytics including:

- Page views and engagement
- Reader demographics
- Content performance trends
- SEO insights

## Making Data-Driven Decisions

With these insights, content creators can optimize their strategy for better results.`,
                description: "Understanding how to leverage advanced analytics for content optimization.",
                status: "published" as const
            },
            {
                title: "Draft: Future Content Ideas",
                content: `# Draft: Future Content Ideas

This is a draft article showcasing how premium users can save drafts.

## Upcoming Topics

- AI and Machine Learning trends
- Web development best practices
- User experience design principles

This draft demonstrates the unlimited storage capabilities for premium users.`,
                description: "A collection of future content ideas and topics to explore.",
                status: "draft" as const
            }
        ];

        for (const article of testArticles) {
            const slug = article.title.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") + "-" + Date.now();

            await client`
                INSERT INTO articles (
                    id, title, slug, content, description, status, "authorId",
                    "metaTitle", "metaDescription", "createdAt", "updatedAt", "publishedAt"
                ) VALUES (
                    ${nanoid()}, ${article.title}, ${slug}, ${article.content}, 
                    ${article.description}, ${article.status}, ${premiumUserId},
                    ${article.title}, ${article.description}, now(), now(),
                    ${article.status === 'published' ? 'now()' : null}
                )
            `;

            console.log(`✅ Added ${article.status} article: "${article.title}"`);
        }

        console.log(`\n🎉 Premium user articles added successfully!`);
        console.log(`\n📊 Premium Test User (premium@test.com) now has:`);
        console.log(`   📝 ${testArticles.filter(a => a.status === 'published').length} published articles`);
        console.log(`   📄 ${testArticles.filter(a => a.status === 'draft').length} draft articles`);

    } catch (error) {
        console.error("❌ Failed to add articles:", error);
        throw error;
    } finally {
        await client.end();
    }
}

addPremiumUserArticles().catch((error) => {
    console.error("Failed to add articles:", error);
    process.exit(1);
});
