import { db } from './lib/db.js';
import { users } from './lib/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function setAdminPassword() {
  try {
    console.log('🔑 Setting admin password...\n');

    // Hash the password
    const password = 'admin123'; // You can change this
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the admin user with the password
    const result = await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.email, 'admin@blog-genny.com'))
      .returning({ id: users.id, email: users.email });

    if (result.length > 0) {
      console.log('✅ Admin password set successfully!');
      console.log('📧 Email: admin@blog-genny.com');
      console.log('🔑 Password: admin123');
      console.log('\n🎯 You can now log in at: http://localhost:3000/auth/signin');
      console.log('🏠 Admin dashboard: http://localhost:3000/admin');
    } else {
      console.log('❌ Admin user not found. Please run the seed script first.');
    }

  } catch (error) {
    console.error('❌ Error setting admin password:', error);
  } finally {
    process.exit();
  }
}

setAdminPassword();
