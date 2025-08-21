import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// import { users } from "../lib/schema.js";
// import { eq } from "drizzle-orm";
import { config } from "dotenv";
import bcrypt from "bcryptjs";

// Load environment variables
config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/blog_generator_dev";

async function addTestUserPasswords() {
    const client = postgres(connectionString, { max: 1 });
    const db = drizzle(client);

    try {
        console.log("🔐 Adding passwords to test users...\n");

        const testPassword = "password123"; // Simple password for testing
        const hashedPassword = await bcrypt.hash(testPassword, 12);

        // Add passwords to test users
        const testUsers = [
            { email: 'premium@test.com', name: 'Premium Test User' },
            { email: 'free@test.com', name: 'Free Test User' },
            { email: 'admin@blog-genny.com', name: 'Blog Admin' }
        ];

        for (const user of testUsers) {
            await client`
                UPDATE users 
                SET password = ${hashedPassword}, "updatedAt" = now()
                WHERE email = ${user.email}
            `;
            console.log(`✅ Password set for: ${user.name} (${user.email})`);
        }

        console.log(`\n🎉 Test user passwords updated!`);
        console.log(`\n🔑 Test Login Credentials:`);
        console.log(`   Premium User: premium@test.com / password123`);
        console.log(`   Free User: free@test.com / password123`);
        console.log(`   Admin User: admin@blog-genny.com / password123`);
        console.log(`\n⚠️  Remember to change these passwords in production!`);

    } catch (error) {
        console.error("❌ Failed to add passwords:", error);
        throw error;
    } finally {
        await client.end();
    }
}

addTestUserPasswords().catch((error) => {
    console.error("Failed to add passwords:", error);
    process.exit(1);
});
