/** @type {import('next').NextConfig} */

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

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
    // Dangerously allow production builds to complete even with type errors
    ignoreBuildErrors: true,
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

if (isVercel) {
  console.log('Running on Vercel with config:', JSON.stringify(nextConfig, null, 2));
}

module.exports = nextConfig;
