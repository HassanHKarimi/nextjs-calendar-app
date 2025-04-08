/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configure for static export
  output: 'export',
  
  // Allow the @neondatabase/serverless package to be transpiled
  transpilePackages: ['@neondatabase/serverless'],
  
  // Add webpack configuration to prevent issues with external dependencies
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'pg-native', '@auth/core', 'bcrypt', 'bcryptjs'];
    }
    return config;
  },
  
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Skip prerendering of pages to avoid auth-related errors
  experimental: {
    appDir: false
  }
};

// Export a simplified config
export default nextConfig;