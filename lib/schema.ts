import { pgTable, text, timestamp, pgEnum, integer, primaryKey } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"])
export const userTierEnum = pgEnum("user_tier", ["free", "premium"])
export const articleStatusEnum = pgEnum("article_status", ["draft", "published", "archived"])

// Users table
export const users = pgTable("users", {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified"),
    image: text("image"),
    password: text("password"),
    role: userRoleEnum("role").default("user").notNull(),
    tier: userTierEnum("tier").default("free").notNull(),
    stripeCustomerId: text("stripeCustomerId").unique(),
    stripeSubscriptionId: text("stripeSubscriptionId").unique(),
    stripePriceId: text("stripePriceId"),
    stripeCurrentPeriodEnd: timestamp("stripeCurrentPeriodEnd"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// NextAuth.js tables
export const accounts = pgTable(
    "accounts",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    }),
)

export const sessions = pgTable("sessions", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires").notNull(),
})

export const verificationTokens = pgTable(
    "verification_tokens",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires").notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    }),
)

// Articles table
export const articles = pgTable("articles", {
    id: text("id").primaryKey().notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(), // MDX content
    description: text("description").notNull(),
    status: articleStatusEnum("status").default("draft").notNull(),
    authorId: text("authorId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    coverImageUrl: text("coverImageUrl"),
    coverImageAttribution: text("coverImageAttribution"),
    heroImage: text("heroImage"),
    heroImageAttribution: text("heroImageAttribution"),
    metaTitle: text("metaTitle"),
    metaDescription: text("metaDescription"),
    tags: text("tags").array(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    publishedAt: timestamp("publishedAt"),
})

// Topics table
export const topics = pgTable("topics", {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
})

// Article topics junction table
export const articleTopics = pgTable(
    "article_topics",
    {
        articleId: text("articleId")
            .notNull()
            .references(() => articles.id, { onDelete: "cascade" }),
        topicId: text("topicId")
            .notNull()
            .references(() => topics.id, { onDelete: "cascade" }),
    },
    (at) => ({
        pk: primaryKey({ columns: [at.articleId, at.topicId] }),
    }),
)

// User preferences junction table
export const userPreferences = pgTable(
    "user_preferences",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        topicId: text("topicId")
            .notNull()
            .references(() => topics.id, { onDelete: "cascade" }),
    },
    (up) => ({
        pk: primaryKey({ columns: [up.userId, up.topicId] }),
    }),
)

// Comments table
export const comments = pgTable("comments", {
    id: text("id").primaryKey().notNull(),
    content: text("content").notNull(),
    articleId: text("articleId")
        .notNull()
        .references(() => articles.id, { onDelete: "cascade" }),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    parentId: text("parentId"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
})

// Likes table
export const likes = pgTable(
    "likes",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        articleId: text("articleId")
            .notNull()
            .references(() => articles.id, { onDelete: "cascade" }),
    },
    (like) => ({
        pk: primaryKey({ columns: [like.userId, like.articleId] }),
    }),
)

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    articles: many(articles),
    comments: many(comments),
    likes: many(likes),
    preferences: many(userPreferences),
}))

export const articlesRelations = relations(articles, ({ one, many }) => ({
    author: one(users, {
        fields: [articles.authorId],
        references: [users.id],
    }),
    topics: many(articleTopics),
    comments: many(comments),
    likes: many(likes),
}))

export const topicsRelations = relations(topics, ({ many }) => ({
    articles: many(articleTopics),
    userPreferences: many(userPreferences),
}))

export const articleTopicsRelations = relations(articleTopics, ({ one }) => ({
    article: one(articles, {
        fields: [articleTopics.articleId],
        references: [articles.id],
    }),
    topic: one(topics, {
        fields: [articleTopics.topicId],
        references: [topics.id],
    }),
}))
