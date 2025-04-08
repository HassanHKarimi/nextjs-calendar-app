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
export const signIn = () => {};
export const signOut = () => {};
export const getSession = () => null;
export const getCsrfToken = () => "";
export const getProviders = () => ({});

// Empty default export for compatibility
export default {};