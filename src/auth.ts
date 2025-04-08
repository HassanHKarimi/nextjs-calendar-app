// Minimal auth stub to avoid @auth/core dependency issues during build

// Define the UserRole type if not automatically imported from Prisma
type UserRole = "USER" | "ADMIN";

// Mock handler functions
const GET = () => new Response();
const POST = () => new Response();

// Export stubs for NextAuth functions
export const handlers = { GET, POST };
export const auth = async () => null;
export const signIn = () => Promise.resolve({ error: "Disabled during build" });
export const signOut = () => Promise.resolve(true);
export const getSession = () => Promise.resolve(null);
export const useSession = () => ({ data: null, status: "unauthenticated" });

// Mock session type
export type Session = {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: UserRole;
    isOAuth?: boolean;
  }
};
