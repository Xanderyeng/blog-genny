import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import { articles } from "../lib/schema.js";
import { eq } from "drizzle-orm";

// Load environment variables
config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/blog_generator_dev";

async function migrateHeroImageData() {
    const client = postgres(connectionString, { max: 1 });
    const db = drizzle(client);

    try {
        console.log("🔄 Starting hero image data migration...\n");

        // Get all articles that have coverImageUrl but no heroImage
        const articlesNeedingMigration = await client`
      SELECT id, "coverImageUrl", "coverImageAttribution", "heroImage", "heroImageAttribution", title
      FROM articles 
      WHERE "coverImageUrl" IS NOT NULL 
      AND ("heroImage" IS NULL OR "heroImage" = '')
    `;

        console.log(`📊 Found ${articlesNeedingMigration.length} articles that need hero image migration:`);

        if (articlesNeedingMigration.length === 0) {
            console.log("✅ No articles need migration. All hero image data is already populated.");
            return;
        }

        // Migrate each article
        for (const article of articlesNeedingMigration) {
            try {
                console.log(`  📝 Migrating: "${article.title}"`);

                // Copy coverImage data to heroImage fields
                await client`
          UPDATE articles 
          SET 
            "heroImage" = ${article.coverImageUrl},
            "heroImageAttribution" = ${article.coverImageAttribution || null},
            "updatedAt" = now()
          WHERE id = ${article.id}
        `;

                console.log(`    ✅ Updated hero image data`);

            } catch (error) {
                console.log(`    ❌ Error migrating ${article.title}:`, (error as Error).message);
            }
        }

        console.log("\n🎉 Hero image data migration completed!");

        // Show summary
        const updatedArticles = await client`
      SELECT COUNT(*) as count
      FROM articles 
      WHERE "heroImage" IS NOT NULL AND "heroImage" != ''
    `;

        console.log("\n📊 Migration Summary:");
        console.log(`   📝 Articles with hero images: ${updatedArticles[0].count}`);

        // Show a few examples of migrated data
        const examples = await client`
      SELECT title, "coverImageUrl", "heroImage"
      FROM articles 
      WHERE "heroImage" IS NOT NULL 
      LIMIT 3
    `;

        console.log("\n📋 Examples of migrated data:");
        examples.forEach((example, i) => {
            const coverMatch = example.coverImageUrl === example.heroImage ? "✅ Match" : "❌ Different";
            console.log(`   ${i + 1}. "${example.title}"`);
            console.log(`      Cover: ${example.coverImageUrl ? 'Set' : 'Not set'}`);
            console.log(`      Hero:  ${example.heroImage ? 'Set' : 'Not set'} (${coverMatch})`);
        });

    } catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    } finally {
        await client.end();
    }
}

migrateHeroImageData().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});
