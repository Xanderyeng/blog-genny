import { db } from './lib/db.js';
import { users, articles, topics, comments, likes } from './lib/schema.js';
import { sql } from 'drizzle-orm';

async function checkDatabaseData() {
  try {
    console.log('🔍 Checking database data...\n');

    // Check users table
    const usersCount = await db.select({ count: sql`count(*)` }).from(users);
    console.log(`👥 Users: ${usersCount[0].count} records`);

    // Check articles table
    const articlesCount = await db.select({ count: sql`count(*)` }).from(articles);
    console.log(`📝 Articles: ${articlesCount[0].count} records`);

    // Check topics table
    const topicsCount = await db.select({ count: sql`count(*)` }).from(topics);
    console.log(`🏷️  Topics: ${topicsCount[0].count} records`);

    // Check comments table
    const commentsCount = await db.select({ count: sql`count(*)` }).from(comments);
    console.log(`💬 Comments: ${commentsCount[0].count} records`);

    // Check likes table
    const likesCount = await db.select({ count: sql`count(*)` }).from(likes);
    console.log(`❤️  Likes: ${likesCount[0].count} records`);

    // If there are articles, show the first few
    if (Number(articlesCount[0].count) > 0) {
      console.log('\n📖 Recent articles:');
      const recentArticles = await db
        .select({
          id: articles.id,
          title: articles.title,
          status: articles.status,
          createdAt: articles.createdAt
        })
        .from(articles)
        .orderBy(articles.createdAt)
        .limit(5);

      recentArticles.forEach((article, index) => {
        console.log(`   ${index + 1}. "${article.title}" (${article.status}) - ${article.createdAt.toLocaleDateString()}`);
      });
    }

    console.log('\n✅ Database check complete!');

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

checkDatabaseData();
