// Minimal auth.js file to reduce dependencies and avoid errors

// Simple auth function that returns null or a mock user session
export async function auth() {
  return null;
}

// Stub for session handling
export async function getServerSession() {
  return null;
}

// Simple stubs for authentication functions
export const signIn = () => Promise.resolve({ error: "Disabled during build" });
export const signOut = () => Promise.resolve(true);
export const getSession = () => null;
export const getCsrfToken = () => "";
export const getProviders = () => ({});
export const useSession = () => ({ data: null, status: "unauthenticated" });

// Handler stubs for API routes
export const handlers = { GET: () => new Response(), POST: () => new Response() };

// Empty default export for compatibility
export default {
  providers: [],
};