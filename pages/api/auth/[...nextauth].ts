// API Route for NextAuth v5
import NextAuth from "next-auth";

// Import auth options from root to avoid circular dependencies
import authOptions from "../../../authOptions";

// Export the NextAuth handler
export default NextAuth(authOptions);