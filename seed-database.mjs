import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { db } from './lib/db.js';
import { createArticle } from './lib/articles.js';
import { nanoid } from 'nanoid';

// For this seed script, we'll create a default admin user
const DEFAULT_ADMIN_USER_ID = 'admin_seed_user';

async function createDefaultAdminUser() {
  try {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.id, DEFAULT_ADMIN_USER_ID)).limit(1);
    
    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: DEFAULT_ADMIN_USER_ID,
        name: 'Admin',
        email: 'admin@localhost',
        role: 'admin',
        tier: 'premium',
      });
      console.log('✅ Created default admin user');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

async function seedFromMDXFiles() {
  console.log('🌱 Starting database seed from MDX files...\n');

  try {
    // Create admin user first
    await createDefaultAdminUser();

    const contentDir = join(process.cwd(), 'content', 'blog');
    const files = readdirSync(contentDir).filter(file => file.endsWith('.mdx'));

    console.log(`📁 Found ${files.length} MDX files to migrate:\n`);

    for (const file of files) {
      try {
        console.log(`📄 Processing: ${file}`);

        const filePath = join(contentDir, file);
        const fileContent = readFileSync(filePath, 'utf8');
        
        // Parse the MDX frontmatter and content
        const { data: frontmatter, content } = matter(fileContent);

        // Extract data from frontmatter
        const title = frontmatter.title || 'Untitled';
        const description = frontmatter.description || 'No description available';
        const coverImageUrl = frontmatter.coverImageUrl || frontmatter.heroImage;
        const coverImageAttribution = frontmatter.coverImageAttribution || frontmatter.heroImageAttribution;

        // Create article in database
        const result = await createArticle({
          title,
          content,
          description,
          authorId: DEFAULT_ADMIN_USER_ID,
          coverImageUrl,
          coverImageAttribution,
          metaTitle: frontmatter.metaTitle || title,
          metaDescription: frontmatter.metaDescription || description,
          status: 'published', // Publish existing content
        });

        if (result.success) {
          console.log(`   ✅ Migrated: "${title}" (ID: ${result.article?.id})`);
        } else {
          console.log(`   ❌ Failed: "${title}" - ${result.error}`);
        }

      } catch (error) {
        console.log(`   ❌ Error processing ${file}:`, error.message);
      }
    }

    console.log('\n🎉 Migration complete!');
    console.log('\n📊 Final database summary:');
    
    // Show final counts
    const totalArticles = await db.select({ count: sql`count(*)` }).from(articles);
    const publishedArticles = await db.select({ count: sql`count(*)` }).from(articles).where(eq(articles.status, 'published'));
    const draftArticles = await db.select({ count: sql`count(*)` }).from(articles).where(eq(articles.status, 'draft'));

    console.log(`   📝 Total articles: ${totalArticles[0].count}`);
    console.log(`   ✅ Published: ${publishedArticles[0].count}`);
    console.log(`   📋 Drafts: ${draftArticles[0].count}`);

  } catch (error) {
    console.error('❌ Seed script failed:', error);
  }
}

// Run the seed script
seedFromMDXFiles();
