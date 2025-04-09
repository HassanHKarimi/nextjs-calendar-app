/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the @neondatabase/serverless package to be transpiled
  transpilePackages: ['@neondatabase/serverless'],
  
  // Add webpack configuration to prevent issues with the pg-native optional dependency
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'pg-native'];
    }
    // Fix for 404 errors in development
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

  // Add experimental features to support NextAuth
  experimental: {
    serverComponentsExternalPackages: ["@auth/core"],
  },

  // Add redirects for NextAuth routes
  async redirects() {
    return [];
  },

  // Add rewrites for NextAuth routes
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      }
    ];
  },
};

export default nextConfig;
