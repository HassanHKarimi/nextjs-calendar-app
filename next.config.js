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
  
  // Set the output directory to match what's in vercel.json
  distDir: 'dist',
  
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

  // Add rewrites for NextAuth and Calendar routes
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
      {
        source: "/calendar/:path*",
        destination: "/calendar/:path*",
      }
    ];
  },
};

module.exports = nextConfig;
