-- Create enums
CREATE TYPE "user_role" AS ENUM ('user', 'admin');
CREATE TYPE "user_tier" AS ENUM ('free', 'premium');
CREATE TYPE "article_status" AS ENUM ('draft', 'published', 'archived');

-- Create users table
CREATE TABLE "users" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text,
  "email" text NOT NULL,
  "emailVerified" timestamp,
  "image" text,
  "password" text,
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

-- Create NextAuth.js tables
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

CREATE TABLE "sessions" (
  "sessionToken" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL,
  "expires" timestamp NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action
);

CREATE TABLE "verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  PRIMARY KEY("identifier", "token")
);

-- Create articles table
CREATE TABLE "articles" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "content" text NOT NULL,
  "description" text NOT NULL,
  "status" "article_status" DEFAULT 'draft' NOT NULL,
  "authorId" text NOT NULL,
  "coverImageUrl" text,
  "coverImageAttribution" text,
  "metaTitle" text,
  "metaDescription" text,
  "tags" text[],
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "publishedAt" timestamp,
  CONSTRAINT "articles_slug_unique" UNIQUE("slug"),
  FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action
);

-- Create topics table
CREATE TABLE "topics" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  CONSTRAINT "topics_name_unique" UNIQUE("name"),
  CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);

-- Create article_topics junction table
CREATE TABLE "article_topics" (
  "articleId" text NOT NULL,
  "topicId" text NOT NULL,
  PRIMARY KEY("articleId", "topicId"),
  FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE cascade ON UPDATE no action,
  FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE cascade ON UPDATE no action
);

-- Create user_preferences junction table
CREATE TABLE "user_preferences" (
  "userId" text NOT NULL,
  "topicId" text NOT NULL,
  PRIMARY KEY("userId", "topicId"),
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action,
  FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE cascade ON UPDATE no action
);

-- Create comments table
CREATE TABLE "comments" (
  "id" text PRIMARY KEY NOT NULL,
  "content" text NOT NULL,
  "articleId" text NOT NULL,
  "userId" text NOT NULL,
  "parentId" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE cascade ON UPDATE no action,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action,
  FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE cascade ON UPDATE no action
);

-- Create likes table
CREATE TABLE "likes" (
  "userId" text NOT NULL,
  "articleId" text NOT NULL,
  PRIMARY KEY("userId", "articleId"),
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action,
  FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE cascade ON UPDATE no action
);
