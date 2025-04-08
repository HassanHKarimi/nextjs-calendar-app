// Stub implementation to avoid @auth/core dependency issues
// This file exists purely for build compatibility

// Define the UserRole type if not automatically imported from Prisma
type UserRole = "USER" | "ADMIN";

// Define simple handler functions
export const GET = () => new Response();
export const POST = () => new Response();

// Mock handlers export
export const handlers = { 
  GET, 
  POST 
};

// Mock auth function
export const auth = async () => null;

// Mock NextAuthHandler
export const NextAuthHandler = async () => null;

// Additional stub functions needed by the application
export const signIn = () => Promise.resolve({ error: "Disabled during build" });
export const signOut = () => Promise.resolve(true);
export const getSession = () => Promise.resolve(null);
export const useSession = () => ({ data: null, status: "unauthenticated" });

// Mock session type to avoid type errors
export type Session = {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: UserRole;
    isOAuth?: boolean;
  }
};
