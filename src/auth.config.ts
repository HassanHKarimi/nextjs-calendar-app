// Stub authentication config to prevent @auth/core dependency issues
// This is a minimal configuration for the build process

// Mock NextAuthConfig type
type NextAuthConfig = {
  providers: Array<any>;
  secret?: string;
};

// Export empty config with no real providers
export default {
  providers: [],
  secret: "build-time-mock-secret",
} satisfies NextAuthConfig;
