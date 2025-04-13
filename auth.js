// This is a compatibility file for NextAuth.js
// Re-exports auth configuration from src/auth
// NextAuth v5 doesn't export GET and POST handlers from the auth config

// Use a direct export to ensure paths work during build
import { authOptions } from "./src/auth";
import NextAuth from "next-auth";

// Create the handler with the auth options
const handler = NextAuth(authOptions);

// Export the handler for API routes
export default handler;
export { authOptions };
