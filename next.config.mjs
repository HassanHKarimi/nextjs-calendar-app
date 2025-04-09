/** @type {import('next').NextConfig} */

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

// Base config shared between environments
const baseConfig = {
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
  
  // Set the output directory to avoid BUILD_ID issues
  distDir: 'dist',
  
  // Disable TypeScript checking during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
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

// If on Vercel, load the Vercel config
if (isVercel) {
  console.log('Running on Vercel, loading Vercel configuration');
  // We could add Vercel-specific overrides here if needed
}

const nextConfig = baseConfig;

export default nextConfig;
