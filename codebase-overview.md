# Codebase Overview

This document provides a detailed analysis of the project's current architecture, functionality, and data flow, based on a review of the codebase.

---

### 1. High-Level Overview

Your project is a well-structured Next.js 15 application designed as an AI-powered blog generation platform. It uses a modern technology stack and follows best practices for React server components.

*   **Technology Stack:**
    *   **Framework:** Next.js 15 (App Router)
    *   **Language:** TypeScript
    *   **Styling:** Tailwind CSS with Shadcn/UI for the component library.
    *   **Content:** MDX for blog posts, managed via `next-mdx-remote`.
    *   **AI:** Google Generative AI (Gemini) for content generation.
    *   **Database & Auth (In-progress):** The `package.json` shows `drizzle-orm`, `postgres`, and `next-auth`, indicating that the project is in the process of transitioning from a file-based system to a full-fledged database-backed application.

### 2. Project Structure

The codebase is organized logically within the `app` directory, with clear separation of concerns.

*   `app/`: The core of the Next.js application.
    *   `layout.tsx`: The root layout, which sets up the HTML structure, fonts (`Inter`, `Roboto_Mono`), and the `ThemeProvider` for light/dark mode.
    *   `page.tsx`: The homepage of the application.
    *   `blog/`: Contains the pages for displaying blog posts.
        *   `page.tsx`: The blog index page that lists all articles.
        *   `[slug]/page.tsx`: The dynamic page for displaying a single article.
    *   `generate/`: The admin-facing section for creating content.
    *   `actions/`: Houses the `generateBlog.ts` server action, which contains the primary backend logic.
*   `components/`: Contains reusable React components.
    *   `ui/`: Holds the base components from Shadcn/UI.
    *   `header.tsx`, `footer.tsx`, `blog-card.tsx`: Custom components that define the site's look and feel.
*   `lib/`: For utility functions and shared logic.
    *   `mdx.ts`: Contains functions (`getAllPosts`, `getPostBySlug`) to read and parse `.mdx` files from the filesystem. It uses `gray-matter` to handle frontmatter.
    *   `utils.ts`: Provides helper functions like `cn` for classnames and `formatDate`.
*   `content/blog/`: The directory where generated `.mdx` files are currently stored.

### 3. Core Functionality & Data Flow

The application has two primary user flows: generating content and viewing content.

**A. Content Generation Flow**

1.  **Initiation:** The flow starts on the `/generate` page (`app/generate/page.tsx`), which presents a form to the user.
2.  **Server Action:** When the user submits a topic, the form calls the `generateBlog` function in `app/actions/generateBlog.ts`.
3.  **AI Interaction:**
    *   The `generateBlog` action first validates the Gemini API key.
    *   It constructs a detailed prompt, instructing the AI to return a JSON object containing a `title`, `description`, `content`, and `tags`.
    *   It calls the Gemini API and parses the JSON response.
4.  **Image Sourcing (Advanced):** The action then calls a `findHeroImage` function (likely from `lib/images.ts`, which was planned) to fetch a relevant hero image from an external service like Unsplash.
5.  **Database Persistence (Advanced):** The action is already set up for Phase 2. Instead of saving a file, it calls `createArticle` to save the title, content, description, and image URL into a database, creating the article as a `draft`.
6.  **Response:** The server action returns a success or error message to the client.

**B. Content Display Flow (MDX File-based)**

1.  **Blog Index Page (`/blog`):**
    *   When a user visits `/blog`, the `BlogIndexPage` component in `app/blog/page.tsx` is rendered on the server.
    *   It calls the `getAllPosts()` function from `lib/mdx.ts`.
    *   `getAllPosts` reads all `.mdx` files from the `content/blog` directory, parses the frontmatter for each, and returns an array of post objects.
    *   The page then maps over this array and renders a `BlogCard` component for each post.
2.  **Single Post Page (`/blog/[slug]`):**
    *   When a user visits a specific post, the `BlogPostPage` in `app/blog/[slug]/page.tsx` is rendered.
    *   It calls `getPostBySlug(slug)` to read and parse the single corresponding `.mdx` file.
    *   If the file is not found, it displays a 404 page.
    *   The MDX content is passed to the `<MDXRemote />` component, which securely renders the markdown as HTML.
    *   The page also dynamically generates metadata (`title`, `description`, `openGraph` image) for SEO.

### 4. Key Observations

*   **Hybrid Approach:** The codebase is in a transitional state. The file-based `lib/mdx.ts` is still present, but the core generation logic in `generateBlog.ts` has already been updated to support a database, showing foresight in the development process.
*   **Component-Driven:** The UI is cleanly built with reusable components (`Header`, `Footer`, `BlogCard`), making it easy to maintain.
*   **Server-First:** The application leverages React Server Components effectively, with data fetching and generation logic living on the server, which is great for performance and security.
*   **Ready for Next Phase:** The presence of Drizzle, NextAuth, and database-aware logic in the server action means the project is perfectly primed to begin Phase 2 (full database integration).
