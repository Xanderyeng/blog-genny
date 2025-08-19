AI Blog Platform Roadmap
📍 Phase 1: Foundation (MDX + Gemini AI Integration)

Goal: Get a working prototype that generates and displays blog posts.

Steps:

Setup Project

Create Next.js 15 (App Router) project

Install Tailwind CSS + Shadcn/UI

Setup MDX for rendering blog articles

Add layout components: Navbar, Footer, Blog layout

Basic Article Flow

Create /blog page to list articles (MDX files from /content)

Add individual article pages (/blog/[slug])

AI Integration

Add Gemini API endpoint (/api/generate)

Create "Generate Article" button in admin-only page

Test by sending prompt → receive content → save to /content/[slug].mdx

✅ At this stage: You can generate articles on demand and render them like a normal blog.
👉 Blog posts are AI-generated but you decide when to create them.

📍 Phase 2: Database & Persistence (Postgres + Drizzle ORM)

Goal: Move from static .mdx files → dynamic Postgres database.

Steps:

Setup Postgres

Deploy Postgres on Coolify

Connect via Prisma/Drizzle ORM

Migrate Articles

Create articles table:

id, title, slug, content, authorId, status (draft, published), createdAt

Store generated content in DB instead of .mdx

Admin Review Flow

Super Admin Dashboard (/admin)

Articles land in drafts table after generation

Admin reviews → Approves → Publishes

Email Integration

Use n8n + SMTP or Resend API to email draft articles to Admin for review before publishing

✅ At this stage: Articles are stored in DB, reviewable via dashboard, and published by admin.

📍 Phase 3: User Accounts & Profiles

Goal: Allow readers to register/login and personalize their experience.

Steps:

Auth Setup

Use NextAuth.js (w/ Postgres adapter)

Support Email/Password, Google login

User Profile

Create users table:

id, username, email, avatar, birthdate, tier (free / premium)

User Settings page to update profile

Personalization

Users select topics of interest (store in user_preferences table)

Articles feed filtered by preferences

✅ At this stage: Users can register, log in, and follow interests.

📍 Phase 4: Monetization & Tiers

Goal: Introduce free vs. premium features.

Free Tier:

Change username + avatar only once

Can view blog posts

Limited personalization

Premium Tier:

Unlimited profile changes

Theme customization (choose from palettes)

Email alerts when new articles are published

Early access to new features

Steps:

Subscription System

Use Stripe for payments

Store tier info in DB

Feature Gatekeeping

Middleware that checks user tier before allowing certain actions

UI shows locked features for free users

✅ At this stage: App becomes monetizable with premium subscriptions.

📍 Phase 5: Advanced AI & Automations

Goal: Fully automate content creation + improve experience.

Steps:

n8n Automations

Schedule prompts to Gemini (daily/weekly topics)

Push drafts directly into DB

Email admin for review

AI Enhancements

Auto-generate SEO metadata (title, description, keywords)

Suggest article cover images via AI (e.g. Stable Diffusion API)

Community Features

Comments system

Likes/reactions on posts

User-generated content (with AI editing assist)

✅ At this stage: Platform is self-sustaining, generating and publishing content with minimal input.

🔑 Key Decisions

Start simple with MDX → move to Postgres (Drizzle ORM) later.

Use NextAuth + Postgres for authentication & profiles.

Use n8n for workflow automation (draft emails, scheduled article generation).

Monetize later with Stripe subscriptions.

👉 To answer your earlier question:

At Phase 1, articles are generated manually by you with the "Generate" button.

At Phase 5, with n8n + scheduled prompts, the blog will auto-generate articles itself.