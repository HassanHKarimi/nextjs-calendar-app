// Using legacy NextAuth.js v4 to avoid compatibility issues
import NextAuth from "next-auth";
import { PrismaAdapter } from "@prisma/adapter-next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import * as bcrypt from "bcrypt";

// Import your local utilities and schemas
import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { getUserByEmail } from "@/data/user";
import { getAccountByUserId } from "@/data/account";

// Define the UserRole type if not automatically imported from Prisma
type UserRole = "USER" | "ADMIN";

/**
 * NextAuth.js configuration
 * This is the primary authentication handler for the application
 */
export default NextAuth({
  // Use database adapter
  adapter: PrismaAdapter(db),
  
  // Use JWT-based sessions for better compatibility
  session: { strategy: "jwt" },
  
  // Custom pages for auth flows
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  
  // Secret used for encryption and token signing
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  
  // Authentication providers
  providers: [
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    
    // Credentials provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const validatedFields = LoginSchema.safeParse(credentials);

          if (validatedFields.success) {
            const { email, password } = validatedFields.data;

            const user = await getUserByEmail(email);
            if (!user || !user.password) return null;

            const passwordsMatch = await bcrypt.compare(
              password,
              user.password,
            );

            if (passwordsMatch) return user;
          }
        } catch (error) {
          console.error("Auth error:", error);
        }

        return null;
      }
    })
  ],
  
  // Callback functions to customize auth behavior
  callbacks: {
    // Control sign-in validation
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      try {
        const existingUser = await getUserById(user.id);

        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }

      return true;
    },
    
    // Customize session data sent to client
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    
    // Customize JWT token data
    async jwt({ token }) {
      if (!token.sub) return token;

      try {
        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;

        const existingAccount = await getAccountByUserId(existingUser.id);

        token.isOAuth = !!existingAccount;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
      } catch (error) {
        console.error("JWT error:", error);
      }

      return token;
    }
  },
  
  // Custom event handlers
  events: {
    // Set email as verified when linking OAuth accounts
    async linkAccount({ user }) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        });
      } catch (error) {
        console.error("Link account error:", error);
      }
    }
  },
});