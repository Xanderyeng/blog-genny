#!/usr/bin/env node

/**
 * Development Helper Script
 * 
 * This script provides easy access to test user credentials and
 * useful development commands for the Blog Generator project.
 */

console.log(`
🎯 Blog Generator - Development Helper
=====================================

🔑 Test User Credentials:
┌─────────────────────┬─────────────────────┬──────────────┬──────────┐
│ User Type           │ Email               │ Password     │ Features │
├─────────────────────┼─────────────────────┼──────────────┼──────────┤
│ 🆓 Free User        │ free@test.com       │ password123  │ Limited  │
│ 👑 Premium User     │ premium@test.com    │ password123  │ Full     │
│ 🛡️  Admin User       │ admin@blog-genny.com│ password123  │ All      │
└─────────────────────┴─────────────────────┴──────────────┴──────────┘

🎯 Test Scenarios:
• Free User: Limited to 5 articles/month, sees upgrade prompts
• Premium User: Unlimited articles, analytics access, no ads
• Admin User: All features plus admin panel and user management

🚀 Quick Start Commands:
• npm run dev          - Start development server
• npm run db:studio     - Open database studio
• npm run build         - Build for production
• npm run lint          - Run linting

📊 Database Commands:
• npx tsx scripts/seed.ts                 - Reseed database
• npx tsx scripts/add-test-passwords.ts   - Reset test passwords
• npx tsx scripts/add-premium-articles.ts - Add sample articles

💡 Pro Tips:
• Use different browsers/incognito for testing multiple users
• Check the user dashboard differences between free/premium
• Test the upgrade flow and premium-only features
• Verify role-based access controls work correctly

🔧 Development URLs:
• App: http://localhost:3000
• Database Studio: http://localhost:4983 (when running)
• Sign In: http://localhost:3000/auth/signin
• Admin Panel: http://localhost:3000/admin

⚠️  Security Note:
These are test credentials for development only!
Never use these in production.
`);

// If running directly (not imported)
if (require.main === module) {
    console.log('\n✨ Happy coding! 🚀\n');
}
