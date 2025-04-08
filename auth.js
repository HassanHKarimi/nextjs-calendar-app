// Root auth.js file to provide compatibility with older NextAuth patterns
// A simplified version to avoid Edge Runtime errors

import { getServerSession } from "next-auth";
import options from "./pages/api/auth/[...nextauth]";

// Export auth functions directly for compatibility
export const auth = async () => {
  return await getServerSession(options);
};

export const signIn = (provider, options) => {
  // Client-side only function
  console.log("Sign in attempted with provider:", provider);
  return { error: "Please use client components for sign in" };
};

export const signOut = () => {
  // Client-side only function
  console.log("Sign out attempted");
  return { error: "Please use client components for sign out" };
};

// Re-export the pages API configuration for compatibility
export default options;
