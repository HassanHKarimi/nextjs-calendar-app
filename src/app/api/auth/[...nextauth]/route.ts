// This file is deprecated in favor of pages/api/auth/[...nextauth].ts
// It has been emptied to avoid conflicts between App Router and Pages Router

// Import the auth methods from the centralized auth module
import { auth } from "@/auth";

// Re-export the auth methods for compatibility
export const { GET, POST } = auth;
