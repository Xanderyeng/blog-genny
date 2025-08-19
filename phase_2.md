# Phase 2: Database Schema

This document provides a detailed database schema designed to support the project from Phase 2 through Phase 5. The schema is structured to handle articles, user authentication (compatible with NextAuth.js), roles, subscriptions, and community features.

The schema is presented using SQL Data Definition Language (DDL) for clarity.

---

## 1. Core Tables: Users & Authentication

These tables are essential for managing users, roles, and authentication sessions. The design is compatible with the NextAuth.js Drizzle adapter.

### `users`

Stores the core user profile information, including their role and subscription status.

```sql
CREATE TYPE "user_role" AS ENUM ('user', 'admin');
CREATE TYPE "user_tier" AS ENUM ('free', 'premium');

CREATE TABLE "users" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text,
  "email" text NOT NULL,
  "emailVerified" timestamp,
  "image" text, -- URL for the user's avatar
  "password" text, -- Hashed password for the credentials provider
  "role" "user_role" DEFAULT 'user' NOT NULL,
  "tier" "user_tier" DEFAULT 'free' NOT NULL,
  "stripeCustomerId" text,
  "stripeSubscriptionId" text,
  "stripePriceId" text,
  "stripeCurrentPeriodEnd" timestamp,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE("email"),
  CONSTRAINT "users_stripeCustomerId_unique" UNIQUE("stripeCustomerId"),
  CONSTRAINT "users_stripeSubscriptionId_unique" UNIQUE("stripeSubscriptionId")
);
```

### `accounts`

Links OAuth accounts (e.g., Google, GitHub) to a user record. Required by NextAuth.js.

```sql
CREATE TABLE "accounts" (
  "userId" text NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  PRIMARY KEY("provider", "providerAccountId"),
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action
);
```

### `sessions`

Stores user session information. Required by NextAuth.js.

```sql
CREATE TABLE "sessions" (
  "sessionToken" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL,
  "expires" timestamp NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action
);
```

### `verification_tokens`

Used for email verification tokens (e.g., for passwordless sign-in). Required by NextAuth.js.

```sql
CREATE TABLE "verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  PRIMARY KEY("identifier", "token")
);
```

---

## 2. Content Management Tables

These tables handle the storage and organization of blog articles and their associated metadata.

### `articles`

This is the main table for your blog posts. It stores the content, status, and AI-generated metadata.

```sql
CREATE TYPE "article_status" AS ENUM ('draft', 'published', 'archived');

CREATE TABLE "articles" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "content" text NOT NULL, -- The full MDX/Markdown content
  "status" "article_status" DEFAULT 'draft' NOT NULL,
  "authorId" text NOT NULL,
  "coverImageUrl" text, -- URL for AI-generated cover image
  "metaTitle" text,
  "metaDescription" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "publishedAt" timestamp,
  CONSTRAINT "articles_slug_unique" UNIQUE("slug"),
  FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action
);
```

### `topics`

Stores the categories or tags that can be assigned to articles.

```sql
CREATE TABLE "topics" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  CONSTRAINT "topics_name_unique" UNIQUE("name"),
  CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);
```

### `article_topics`

A many-to-many join table that links articles to their respective topics.

```sql
CREATE TABLE "article_topics" (
  "articleId" text NOT NULL,
  "topicId" text NOT NULL,
  PRIMARY KEY("articleId", "topicId"),
  FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE cascade ON UPDATE no action,
  FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE cascade ON UPDATE no action
);
```

---

## 3. Community & Personalization Tables

These tables support user interaction features like comments, likes, and content personalization.

### `user_preferences`

A many-to-many join table that links users to the topics they are interested in.

```sql
CREATE TABLE "user_preferences" (
  "userId" text NOT NULL,
  "topicId" text NOT NULL,
  PRIMARY KEY("userId", "topicId"),
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action,
  FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE cascade ON UPDATE no action
);
```

### `comments`

Stores user comments on articles. Includes a self-referencing `parentId` to allow for threaded conversations.

```sql
CREATE TABLE "comments" (
  "id" text PRIMARY KEY NOT NULL,
  "content" text NOT NULL,
  "articleId" text NOT NULL,
  "userId" text NOT NULL,
  "parentId" text, -- For threaded comments
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE cascade ON UPDATE no action,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action,
  FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE cascade ON UPDATE no action
);
```

### `likes`

Tracks which users have liked which articles. The existence of a row indicates a "like".

```sql
CREATE TABLE "likes" (
  "userId" text NOT NULL,
  "articleId" text NOT NULL,
  PRIMARY KEY("userId", "articleId"),
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action,
  FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE cascade ON UPDATE no action
);
```
