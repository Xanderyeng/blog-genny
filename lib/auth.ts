import type { NextAuthOptions } from "next-auth"
import { v4 as uuidv4 } from 'uuid';
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1)

        if (!user[0]) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user[0].password || "")

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user[0].id,
          email: user[0].email,
          name: user[0].name,
          role: user[0].role as "user" | "admin",
          tier: user[0].tier as "free" | "premium",
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // This is the first sign-in
        token.role = user.role
        const dbUser = await db.select().from(users).where(eq(users.email, user.email!)).limit(1)
        if (!dbUser[0]) {
          // Create a new user if one doesn't exist
          const newUser = await db.insert(users).values({
            id: uuidv4(),
            email: user.email!,
            name: user.name,
            role: "user",
            tier: "free",
          }).returning()
          token.role = newUser[0].role
          token.tier = newUser[0].tier
        } else {
          token.role = dbUser[0].role
          token.tier = dbUser[0].tier
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as "user" | "admin"
        session.user.tier = token.tier as "free" | "premium"
        session.user.image = token.picture
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}
