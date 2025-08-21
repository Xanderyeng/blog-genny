import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"

// Load environment variables from .env.local
config({ path: ".env.local" })

export default defineConfig({
    schema: "./lib/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL || "postgres://postgres:1lBwoD7v46jST9sOg1X5TKKYWB8gX7Nygt5G1sO7RAkqRhKVwfMPL7Zrx3kwtXdZ@217.77.2.253:5432/postgres",
    },
})
