// API Route for NextAuth v5
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

// Import auth options from root to avoid circular dependencies
import authOptions from "../../../authOptions";

// Ensure the auth options match the expected NextAuthConfig type
const typedAuthOptions = authOptions as NextAuthConfig;

// Export the NextAuth handler
export default NextAuth(typedAuthOptions);