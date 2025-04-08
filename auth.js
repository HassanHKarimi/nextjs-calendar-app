// Root auth.js file to provide compatibility with older NextAuth patterns
// and make authentication utilities available throughout the application

import NextAuth from "next-auth";

// Import the configuration from the Pages API route
import options from "./pages/api/auth/[...nextauth]";

// Export a simplified auth client for use in components and API routes
export const { 
  auth, 
  handlers, 
  signIn, 
  signOut, 
  getProviders,
  getSession,
  getCsrfToken,
  getServerSession
} = NextAuth(options);

// Re-export the pages API configuration for compatibility
export default options;
