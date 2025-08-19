import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { articles } from "../lib/schema.js";
import { sql, eq } from "drizzle-orm";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/blog_generator_dev";

async function removeDuplicates() {
    const client = postgres(connectionString, { max: 1 });
    const db = drizzle(client);

    try {
        console.log("🧹 Removing duplicate articles...\n");

        // Find duplicates by title and keep only the most recent one
        const duplicates = await client`
      SELECT title, COUNT(*) as count, 
             ARRAY_AGG(id ORDER BY "createdAt" DESC) as ids
      FROM articles 
      GROUP BY title 
      HAVING COUNT(*) > 1
    `;

        console.log(`Found ${duplicates.length} groups of duplicate articles:`);

        for (const group of duplicates) {
            console.log(`\n📝 "${group.title}" - ${group.count} copies`);

            // Keep the first (most recent) and delete the rest
            const idsToDelete = group.ids.slice(1); // Remove first element (keep it)

            if (idsToDelete.length > 0) {
                await client`
          DELETE FROM articles 
          WHERE id = ANY(${idsToDelete})
        `;
                console.log(`   ❌ Deleted ${idsToDelete.length} duplicate(s)`);
                console.log(`   ✅ Kept most recent copy`);
            }
        }

        // Show final count
        const finalCount = await client`SELECT COUNT(*) FROM articles`;
        console.log(`\n🎉 Cleanup complete! Total articles: ${finalCount[0].count}`);

    } catch (error) {
        console.error("❌ Error removing duplicates:", error);
        throw error;
    } finally {
        await client.end();
    }
}

removeDuplicates().catch((error) => {
    console.error("Cleanup failed:", error);
    process.exit(1);
});
