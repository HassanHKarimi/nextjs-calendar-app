/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the @neondatabase/serverless package to be transpiled
  transpilePackages: ['@neondatabase/serverless'],
  
  // Add webpack configuration to prevent issues with the pg-native optional dependency
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'pg-native'];
    }
    // Fix for 404 errors in production
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    // Add path aliases for proper resolution
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/data': path.resolve(__dirname, 'data'),
      '@/schemas': path.resolve(__dirname, 'schemas'),
      '@/auth': path.resolve(__dirname, 'auth.js'),
    };
    
    return config;
  },
  
  // Set the output directory for Vercel
  distDir: 'dist',

  // Disable TypeScript checking during build for Vercel deployment
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  // Disable ESLint during build for Vercel deployment
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

module.exports = nextConfig;
