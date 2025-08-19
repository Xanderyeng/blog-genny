const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function checkDatabase() {
  try {
    console.log('🔍 Checking database tables...\n');

    // Check if tables exist and have data
    const tables = [
      'users',
      'articles', 
      'topics',
      'comments',
      'likes',
      'accounts',
      'sessions'
    ];

    for (const table of tables) {
      try {
        const result = await client`SELECT COUNT(*) FROM ${client(table)}`;
        console.log(`📊 ${table}: ${result[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table}: Error - ${error.message}`);
      }
    }

    // Check articles specifically
    try {
      const articles = await client`
        SELECT id, title, status, created_at 
        FROM articles 
        ORDER BY created_at DESC 
        LIMIT 3
      `;
      
      if (articles.length > 0) {
        console.log('\n📖 Recent articles:');
        articles.forEach((article, index) => {
          console.log(`   ${index + 1}. "${article.title}" (${article.status})`);
        });
      } else {
        console.log('\n📝 No articles found in database');
      }
    } catch (error) {
      console.log('\n📝 Articles table might be empty or have different structure');
    }

    console.log('\n✅ Database check complete!');

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();
