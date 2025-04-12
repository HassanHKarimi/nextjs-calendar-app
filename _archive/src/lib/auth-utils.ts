import crypto from 'crypto';

/**
 * Generates a secure random string to use as a fallback auth secret
 * if none is provided in the environment variables
 */
export function getAuthSecret(): string {
  // Use the environment variable if it exists
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }

  // Otherwise, generate a reasonably secure fallback (for dev only)
  // This should never be used in production, but prevents the auth error
  const fallbackSecret = crypto.randomBytes(32).toString('hex');
  console.warn("WARNING: Using a fallback NEXTAUTH_SECRET. Set NEXTAUTH_SECRET in your environment for production.");
  
  return fallbackSecret;
}
