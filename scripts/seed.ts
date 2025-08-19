import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { users, articles, topics } from "../lib/schema.js";
import { eq, sql } from "drizzle-orm";
import { config } from "dotenv";
import { nanoid } from "nanoid";

// Load environment variables
config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/blog_generator_dev";

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .substring(0, 100);
}

// Helper function to extract description from content
function extractDescription(content: string): string {
    const cleanContent = content
        .replace(/^#.*/gm, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .trim();

    const firstParagraph = cleanContent.split('\n\n')[0];
    return firstParagraph.substring(0, 200) + (firstParagraph.length > 200 ? '...' : '');
}

async function seedDatabase() {
    const client = postgres(connectionString, { max: 1 });
    const db = drizzle(client);

    try {
        console.log("🌱 Starting database seeding...\n");

        // 1. Insert admin user, premium test user, and topics using raw SQL
        console.log("📊 Inserting users and topics...");

        // Insert admin user
        await client`
      INSERT INTO users (id, name, email, role, tier, "createdAt", "updatedAt")
      VALUES ('admin-001', 'Blog Admin', 'admin@blog-genny.com', 'admin', 'premium', now(), now())
      ON CONFLICT (email) DO NOTHING
    `;

        // Insert premium test user
        await client`
      INSERT INTO users (id, name, email, role, tier, "createdAt", "updatedAt")
      VALUES ('premium-test-001', 'Premium Test User', 'premium@test.com', 'user', 'premium', now(), now())
      ON CONFLICT (email) DO NOTHING
    `;

        // Insert free test user
        await client`
      INSERT INTO users (id, name, email, role, tier, "createdAt", "updatedAt")
      VALUES ('free-test-001', 'Free Test User', 'free@test.com', 'user', 'free', now(), now())
      ON CONFLICT (email) DO NOTHING
    `;

        await client`
      INSERT INTO topics (id, name, slug) VALUES
        ('topic-tech', 'Technology', 'technology'),
        ('topic-ai', 'Artificial Intelligence', 'artificial-intelligence'),
        ('topic-web', 'Web Development', 'web-development'),
        ('topic-design', 'Design', 'design'),
        ('topic-business', 'Business', 'business'),
        ('topic-lifestyle', 'Lifestyle', 'lifestyle')
      ON CONFLICT (slug) DO NOTHING
    `;

        console.log("✅ Basic data inserted");

        // 2. Parse and import MDX files
        console.log("\n📄 Importing MDX files...");

        const contentDir = join(process.cwd(), "content", "blog");
        const mdxFiles = readdirSync(contentDir).filter(file => file.endsWith('.mdx'));

        console.log(`Found ${mdxFiles.length} MDX files to import:`);

        for (const filename of mdxFiles) {
            try {
                console.log(`  📝 Processing: ${filename}`);

                const filePath = join(contentDir, filename);
                const fileContent = readFileSync(filePath, "utf-8");
                const { data: frontmatter, content } = matter(fileContent);

                const title = frontmatter.title || content.match(/^#\s+(.+)$/m)?.[1] || filename.replace(/\.mdx$/, '');
                const description = frontmatter.description || extractDescription(content);
                const slug = generateSlug(title) + "-" + Date.now();

                // Insert article directly
                await client`
          INSERT INTO articles (
            id, title, slug, content, description, status, "authorId", 
            "coverImageUrl", "coverImageAttribution", "metaTitle", "metaDescription",
            "createdAt", "updatedAt", "publishedAt"
          ) VALUES (
            ${nanoid()}, ${title}, ${slug}, ${content}, ${description}, 'published', 'admin-001',
            ${frontmatter.coverImageUrl || null}, ${frontmatter.coverImageAttribution || null},
            ${frontmatter.metaTitle || title}, ${frontmatter.metaDescription || description},
            now(), now(), now()
          )
        `;

                console.log(`    ✅ Imported: "${title}"`);

            } catch (error) {
                console.log(`    ❌ Error processing ${filename}:`, (error as Error).message);
            }
        }

        console.log("\n🎉 Database seeding completed!");

        // Show summary
        const articleCount = await client`SELECT COUNT(*) FROM articles`;
        const topicCount = await client`SELECT COUNT(*) FROM topics`;

        console.log("\n📊 Summary:");
        console.log(`   👥 Users: 3 (1 admin, 1 premium, 1 free)`);
        console.log(`   📝 Articles: ${articleCount[0].count}`);
        console.log(`   🏷️  Topics: ${topicCount[0].count}`);

        console.log("\n🔑 Test User Credentials:");
        console.log("   Premium User: premium@test.com");
        console.log("   Free User: free@test.com");
        console.log("   Admin User: admin@blog-genny.com");
        console.log("   Note: These users don't have passwords set - use OAuth or add passwords manually");

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        throw error;
    } finally {
        await client.end();
    }
}

seedDatabase().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
