# Blog Generation Platform: Detailed Roadmap

This document breaks down the development of the AI Blog Platform into five distinct phases, providing a step-by-step guide for implementation.

---

### Phase 1: Foundation (MDX + Gemini AI Integration)

**Goal:** Build a minimum viable product that can generate blog posts using the Gemini AI and render them from local MDX files.

**Steps:**

1.  **Project Setup:**
    *   Initialize a new Next.js 15 project using the App Router.
    *   Integrate Tailwind CSS for utility-first styling.
    *   Install and configure Shadcn/UI for a consistent component library.
    *   Set up MDX support by installing and configuring `next-mdx-remote` or a similar library in `next.config.ts`.

2.  **Create Core Layout:**
    *   Develop reusable layout components: `Header.tsx` for navigation and `Footer.tsx` for site-wide links.
    *   Implement a specific layout for blog articles to ensure consistent formatting.

3.  **Implement Basic Article Flow:**
    *   Create a `content/blog` directory to store the generated `.mdx` article files.
    *   Build the main blog listing page at `app/blog/page.tsx`. This page will read all `.mdx` files from the `content/blog` directory and display them as a list of clickable cards.
    *   Create a dynamic route at `app/blog/[slug]/page.tsx` to render individual articles. This component will parse and display the MDX content corresponding to the URL slug.

4.  **Integrate Gemini AI:**
    *   Create a simple, admin-only page at `app/generate/page.tsx`.
    *   Add a form to this page containing a `textarea` for the blog post prompt and a "Generate Article" button.
    *   Create a server action or an API route (`app/api/posts/route.ts`) that accepts the prompt.
    *   This endpoint will call the Gemini API to generate the article content.
    *   Upon receiving the content, it will be saved as a new `.mdx` file in the `content/blog` directory. The filename will be derived from the article's title to create a URL-friendly slug.

---

### Phase 2: Database & Persistence (Postgres + Drizzle ORM)

**Goal:** Transition from a static file-based system to a dynamic database for storing and managing articles.

**Steps:**

1.  **Set Up Database and ORM:**
    *   Provision a PostgreSQL database (e.g., using Vercel Postgres, Supabase, or a local Docker container).
    *   Install Drizzle ORM and the `pg` driver.
    *   Configure Drizzle to connect to your new database.

2.  **Define and Migrate Schema:**
    *   Create a Drizzle schema defining the `articles` table with columns: `id`, `title`, `slug`, `content`, `status` (e.g., 'draft', 'published'), and `createdAt`.
    *   Run Drizzle's migration tool to create the `articles` table in your database.

3.  **Update Article Flow:**
    *   Modify the AI generation logic: instead of writing to an `.mdx` file, it will now insert a new record into the `articles` table with a default `status` of `'draft'`.
    *   Update the blog listing page (`/blog`) to fetch all articles where `status` is `'published'` from the database.
    *   Update the individual article page (`/blog/[slug]`) to retrieve and render article content from the database based on the slug.

4.  **Build Admin Review Dashboard:**
    *   Create a new admin dashboard page at `/admin`.
    *   This dashboard will display a list of all articles with the `status` of `'draft'`.
    *   For each draft, add "Approve" and "Reject" buttons.
        *   **Approve:** Changes the article's `status` to `'published'`.
        *   **Reject:** Deletes the article record from the database.

5.  **Implement Email Notifications:**
    *   Integrate an email service like Resend.
    *   After a new article is generated and saved as a draft, trigger an email to the admin's address, notifying them that a new post is ready for review and providing a direct link to the admin dashboard.

---

### Phase 3: User Accounts & Profiles

**Goal:** Introduce user authentication and allow for a personalized experience.

**Steps:**

1.  **Set Up Authentication:**
    *   Install and configure NextAuth.js.
    *   Use the Drizzle ORM adapter for NextAuth to store user data in your Postgres database.
    *   Configure authentication providers for both Email/Password and Google OAuth.
    *   Protect the `/admin` and `/generate` routes to ensure they are only accessible to authenticated admin users.

2.  **Develop User Profile Management:**
    *   Define a `users` table schema (if not fully covered by NextAuth) to include fields like `username`, `avatar`, and `tier`.
    *   Create a user settings page where authenticated users can update their profile information.

3.  **Enable Personalization:**
    *   Create a `topics` table and a `user_preferences` join table (`userId`, `topicId`).
    *   On the user settings page, allow users to select topics of interest.
    *   Modify the main blog feed to filter articles based on the logged-in user's topic preferences. If the user is not logged in, display all published articles.

---

### Phase 4: Monetization & Tiers

**Goal:** Introduce a subscription model with free and premium tiers.

**Steps:**

1.  **Integrate Stripe for Subscriptions:**
    *   Set up a Stripe account and create products for your premium subscription tier.
    *   Implement Stripe Checkout to handle payments.
    *   Create API endpoints to listen for Stripe webhooks (e.g., `checkout.session.completed`) to update a user's `tier` in the database from `'free'` to `'premium'`.

2.  **Implement Feature Gating:**
    *   Use Next.js middleware to check the user's session and determine their subscription `tier`.
    *   Restrict access to premium features based on this tier. For example:
        *   Limit free users to one profile update.
        *   Allow premium users to access exclusive theme customization options.
    *   Update the UI to visually lock premium features and display prompts to encourage free users to upgrade.

---

### Phase 5: Advanced AI & Automations

**Goal:** Fully automate the content pipeline and enhance the user experience with more AI-powered features.

**Steps:**

1.  **Automate Content Creation:**
    *   Use a scheduling service (like Vercel Cron Jobs or a tool like n8n) to trigger the AI generation process automatically (e.g., daily or weekly).
    *   The scheduled job will use a predefined set of prompts to call your API endpoint, which will generate new articles and save them as drafts in the database.

2.  **Enhance AI Capabilities:**
    *   Expand the AI generation service to also create SEO metadata. After generating the article body, make subsequent AI calls to produce a meta title, description, and relevant tags.
    *   Integrate an image generation API (e.g., Stable Diffusion, DALL-E) to automatically create a unique cover image for each new article based on its content.

3.  **Build Community Features:**
    *   **Comments System:**
        *   Create a `comments` table in the database.
        *   Add a form to the article page allowing authenticated users to post comments.
        *   Display all comments for an article below the content.
    *   **Likes/Reactions:**
        *   Create a `likes` table to track user reactions.
        *   Add a "Like" button to each article that, when clicked, adds or removes an entry in the table.
        *   Display the total like count on both the article page and the main blog list.
