import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[v0] NextAuth authorize called with:", { email: credentials?.email })

        if (!credentials?.email || !credentials?.password) {
          console.log("[v0] Missing credentials")
          return null
        }

        try {
          console.log("[v0] Testing database connection...")
          await prisma.$connect()
          console.log("[v0] Database connected successfully")

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          console.log("[v0] User found:", user ? "Yes" : "No")

          if (!user) {
            console.log("[v0] User not found for email:", credentials.email)
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log("[v0] Password valid:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("[v0] Invalid password")
            return null
          }

          console.log("[v0] Authentication successful for user:", user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone || undefined,
          }
        } catch (error) {
          console.error("[v0] Auth error:", error)
          return null
        } finally {
          await prisma.$disconnect()
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.phone = token.phone as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("[v0] NextAuth Error:", code, metadata)
    },
    warn(code) {
      console.warn("[v0] NextAuth Warning:", code)
    },
    debug(code, metadata) {
      console.log("[v0] NextAuth Debug:", code, metadata)
    },
  },
}
