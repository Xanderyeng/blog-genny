import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL || "postgresql://myuser:mypassword@localhost:5432/blog_generator_dev"

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
// ✅ Initialize the Drizzle client with the imported schema
export const db = drizzle(client, { schema })
