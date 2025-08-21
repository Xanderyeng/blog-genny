import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

const connectionString = process.env.DATABASE_URL || "postgres://postgres:1lBwoD7v46jST9sOg1X5TKKYWB8gX7Nygt5G1sO7RAkqRhKVwfMPL7Zrx3kwtXdZ@217.77.2.253:5432/postgres"

async function main() {
  const client = postgres(connectionString, { max: 1 })
  const db = drizzle(client)

  console.log("Running migrations...")
  await migrate(db, { migrationsFolder: "./drizzle" })
  console.log("Migrations completed!")

  await client.end()
}

main().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})
