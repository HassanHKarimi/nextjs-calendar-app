// src/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
// For NextAuth v5, the correct type is AuthOptions, not NextAuthOptions
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize Prisma client
const prisma = new PrismaClient();

// Define the credentials type for better type checking
interface CredentialsType {
  email: string;
  password: string;
}

// Create an auth handler with credentials using proper types
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Type safety check
        const typedCredentials = credentials as CredentialsType;
        
        if (!typedCredentials?.email || !typedCredentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: typedCredentials.email
            }
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            typedCredentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "USER"
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  pages: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    error: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

// Create the handler with typed options
const handler = NextAuth(authOptions);

// Export GET and POST handlers for API routes
export const { GET, POST } = handler;
