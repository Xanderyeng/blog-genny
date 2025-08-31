# Codebase Revision: AI-Powered Blog Generator

This document provides a comprehensive overview of the "Blog Genny" application, an AI-powered blog generation platform.

## 1. Project Overview

The application is a modern, full-stack blog platform built with Next.js. Its primary function is to generate SEO-friendly blog posts using Google's Gemini AI. It features a clean, responsive user interface with light and dark modes, user authentication, and content management capabilities.

- **Name**: `blog-generator`
- **Version**: 0.1.0
- **Private**: Yes
- **Framework**: Next.js 15

## 2. Core Features

- **AI Article Generation**: Users can generate full blog articles by providing a topic. The backend action `app/actions/generateBlog.ts` handles the logic, calling the Gemini API and saving the result to the database.
- **User Authentication**: A complete authentication system is in place using `next-auth`, allowing users to sign up, sign in (including password-based and OAuth), and manage their sessions.
- **Database & Schema**: The project uses PostgreSQL with Drizzle ORM. The schema, defined in `lib/schema.ts`, includes tables for `users`, `articles`, `accounts`, `sessions`, `comments`, `likes`, and `topics`.
- **Content Management**:
    - Articles are stored in the database and can have statuses like `draft`, `published`, or `archived`.
    - Generated content is in Markdown (MDX) format.
- **User & Admin Roles**: The `users` table has a `role` enum (`user`, `admin`), suggesting different permission levels.
- **Premium Tier**: The `users` table also includes a `tier` enum (`free`, `premium`) and Stripe-related fields, indicating a monetization strategy is implemented or planned.
- **API Endpoints**: The `app/api/` directory suggests RESTful or RPC endpoints for various resources like posts, users, and admin functions.
- **Search**: The `app/search/page.tsx` file indicates a search functionality for finding articles.
- **User Dashboard**: A dedicated dashboard for users to manage their articles and settings.

## 3. Technology Stack

- **Framework**: Next.js 15 (with App Router & Turbopack)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Authentication**: NextAuth.js (`next-auth`, `@auth/drizzle-adapter`)
- **AI**: Google Gemini AI (`@google/generative-ai`)
- **UI Components**: `shadcn/ui` (indicated by Radix UI components like `AlertDialog`, `Avatar`, `DropdownMenu`, etc.)
- **Styling**: Tailwind CSS
- **Content**: MDX (`@mdx-js/react`, `@next/mdx`)
- **State Management**: React Query (`@tanstack/react-query`) for server-state management.
- **Icons**: Lucide React (`lucide-react`)

## 4. Database Schema (`lib/schema.ts`)

The database is structured to support a full-featured blog and community platform:

- **`users`**: Stores user information, including authentication details, roles (`admin`, `user`), and subscription tier (`free`, `premium`).
- **`articles`**: The core table for blog posts. It stores the title, slug, content (MDX), status, author, and metadata.
- **`accounts`, `sessions`, `verificationTokens`**: Standard tables for `next-auth` integration.
- **`topics`**: A table for categorizing articles.
- **`articleTopics`**: A junction table linking articles to topics.
- **`comments`**: Supports nested comments on articles.
- **`likes`**: Tracks user likes on articles.
- **`userPreferences`**: Links users to their preferred topics.

## 5. Key Operations

### Article Generation (`app/actions/generateBlog.ts`)

This is a server action that performs the following steps:
1.  Checks if the user is authenticated.
2.  Validates the presence of the `GEMINI_API_KEY`.
3.  Constructs a detailed prompt for the Gemini `gemini-1.5-flash` model, requesting a JSON object containing a title, description, content (Markdown), and tags.
4.  Calls the Gemini API to generate the content.
5.  Cleans and parses the JSON response.
6.  Performs content sanitization, including fixing incomplete code blocks and escaping characters.
7.  Uses `findHeroImage` to get a relevant cover image for the article.
8.  Saves the new article to the database with a `draft` status using the `createArticle` function.
9.  Returns the new article's ID and slug upon success.

## 6. Available Scripts (`package.json`)

- `dev`: Starts the development server with Turbopack.
- `build`: Creates a production build of the application.
- `start`: Starts the production server.
- `lint`: Lints the codebase using Next.js's ESLint configuration.
- `db:generate`: Generates Drizzle ORM migration files based on schema changes.
- `db:migrate`: Applies generated migrations to the database.
- `db:push`: Pushes schema changes directly to the database (for development).
- `db:studio`: Opens the Drizzle Studio to browse the database.
- `db:seed`: Seeds the database using the `scripts/seed.ts` script.

## 7. Directory Structure

- **`app/`**: The main application directory (Next.js App Router).
  - **`actions/`**: Contains server actions (e.g., `generateBlog.ts`).
  - **`api/`**: API route handlers.
  - **`admin/`, `dashboard/`**: Routes for admin and user-specific pages.
  - **`blog/[slug]/`**: Dynamic routes for displaying individual blog posts.
  - **`generate/`**: The page for the article generation UI.
- **`components/`**: Reusable React components, organized by feature and including `ui/` for generic components (from shadcn/ui).
- **`lib/`**: Core logic, utilities, and configurations.
  - **`auth.ts`**: `next-auth` configuration.
  - **`db.ts`**: Drizzle DB client setup.
  - **`schema.ts`**: Database schema definition for Drizzle.
  - **`mdx.ts`**: Utilities for processing MDX content.
- **`drizzle/`**: Contains SQL migration files generated by Drizzle Kit.
- **`content/`**: Likely used for storing generated `.mdx` files if they were saved to the filesystem (though the current logic saves to DB).
- **`scripts/`**: Node.js/TypeScript scripts for various development and maintenance tasks (e.g., seeding the database).
