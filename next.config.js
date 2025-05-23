/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic React settings
  reactStrictMode: true,
  
  // Allow the @neondatabase/serverless package to be transpiled
  transpilePackages: ['@neondatabase/serverless'],
  
  // Add webpack configuration to prevent issues with the pg-native optional dependency
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'pg-native'];
    }
    // Fix for 404 errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  
  // Set the output directory for the build
  distDir: 'dist',
  
  // Add trailing slash to URLs (fixes static export routing)
  trailingSlash: true,
  
  // Enable static export mode
  output: 'export',
  
  // Important for static export - don't use image optimization
  images: { unoptimized: true },
  
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: "tsconfig.json"
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // External packages config to support NextAuth
  serverExternalPackages: ["@auth/core"],

  // NOTE: Rewrites only work in server mode, not with static export
  // For static export, we rely on the HTML files being properly named
};

module.exports = nextConfig;
