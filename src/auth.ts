// src/auth.ts - For NextAuth v5
import { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Initialize Prisma client
const prisma = new PrismaClient();

// Define type for credentials
interface CredentialsType {
  email: string;
  password: string;
}

// Define the auth configuration (v5 doesn't use NextAuthOptions or AuthOptions)
export const authOptions = {
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
    strategy: "jwt"
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
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  }
};

// No longer need to export a handler directly in the auth.ts file for NextAuth v5