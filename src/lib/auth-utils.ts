/**
 * Returns a static auth secret for build-time usage
 * This avoids crypto dependencies during build time
 */
export function getAuthSecret(): string {
  // For build time only, use a static secret
  // This is only used for static page generation
  return "build-time-mock-secret";
}

/**
 * Stub function for authentication checks
 */
export function isAuthenticated(): boolean {
  return false;
}

/**
 * Stub function for role-based access control
 */
export function hasRole(role: string): boolean {
  return false;
}
