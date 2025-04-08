// Root auth.js file provides legacy compatibility for NextAuth v4
// This simplified export makes the file safer for edge environments

import { getSession, getCsrfToken, getProviders } from "next-auth/react";
import options from "./pages/api/auth/[...nextauth]";

// Export session utilities
export {
  getSession,
  getCsrfToken,
  getProviders
};

// Basic wrapper for getServerSession for compatibility
export async function getServerSession(req, res) {
  const { getServerSession } = await import("next-auth");
  return await getServerSession(req, res, options);
}

// Legacy auth function for compatibility
export async function auth() {
  // This is a simpler implementation that avoids edge runtime issues
  return null;
}

// Re-export the options configuration for API usage
export default options;