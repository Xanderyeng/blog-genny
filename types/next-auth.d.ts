import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "user" | "admin"
      tier: "free" | "premium"
    } & DefaultSession["user"]
  }

  interface User {
    role: "user" | "admin"
    tier: "free" | "premium"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "user" | "admin"
    tier: "free" | "premium"
  }
}
declare module "next-auth/adapters" {
  interface AdapterUser {
    role: "user" | "admin"
    tier: "free" | "premium"
  }
}