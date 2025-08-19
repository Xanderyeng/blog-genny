import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/db"
import { users, accounts, sessions, verificationTokens } from "@/lib/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as any,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1)

        if (!user[0]) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password as string, user[0].password || "")

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user[0].id,
          email: user[0].email,
          name: user[0].name,
          role: user[0].role,
          tier: user[0].tier,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.tier = user.tier
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as "user" | "admin"
        session.user.tier = token.tier as "free" | "premium"
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}

export default NextAuth(authOptions)

// Export for server-side usage
export const getServerSession = (req: any, res: any) => {
  return NextAuth(authOptions).getServerSession(req, res)
}
