// Custom type declarations for NextAuth v5
import { DefaultSession } from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  // Extend the user type
  interface User {
    id: string;
    role?: string;
    name?: string;
    email?: string;
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
