// Test script to verify database connection and article functions
import { db } from "./lib/db.js"
import { users, articles } from "./lib/schema.js"
import { createArticle, getArticles } from "./lib/articles.js"

async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...")
    
    // Test basic connection
    const result = await db.select().from(users).limit(1)
    console.log("✅ Database connection successful!")
    
    console.log("📊 Current article count:")
    const articlesCount = await getArticles({ limit: 1 })
    console.log(`Found ${articlesCount.total} articles`)
    
    console.log("✅ Database and article functions working correctly!")
    
  } catch (error) {
    console.error("❌ Database test failed:", error.message)
  }
}

testDatabase()
