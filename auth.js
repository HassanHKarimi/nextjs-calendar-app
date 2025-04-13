// This is a compatibility file for NextAuth.js
// Re-exports auth configuration from src/auth

// Use a direct export to ensure paths work during build
import { authOptions, GET, POST } from "./src/auth";
export { authOptions, GET, POST };
