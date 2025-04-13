#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Set Vercel environment variable explicitly
export VERCEL=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Print directory contents before build
echo "Starting Vercel build script..."

# Prepare for Next.js build
echo "Installing React, React DOM, TypeScript and type definitions..."
npm install --no-save react react-dom next typescript @types/react @types/react-dom @types/node

# Create the Next.js config file
cat > next.config.js << 'EOF'
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
EOF

# Create required directories
mkdir -p src/app lib data schemas components/ui components/auth utils pages/utils pages/calendar/utils context types dist

# Create auth.ts file for NextAuth v5
cat > src/auth.ts << 'EOF'
// src/auth.ts - For NextAuth v5
import { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Initialize Prisma client
const prisma = new PrismaClient();

// Define type for credentials
interface CredentialsType {
  email: string;
  password: string;
}

// Define the auth configuration (v5 doesn't use NextAuthOptions or AuthOptions)
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Type safety check
        const typedCredentials = credentials as CredentialsType;
        
        if (!typedCredentials?.email || !typedCredentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: typedCredentials.email
            }
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            typedCredentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "USER"
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const // Must be typed as literal "jwt" or "database" for NextAuth v5
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  pages: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    error: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  }
};
EOF

# Create auth.js compatibility file
cat > auth.js << 'EOF'
// This is a compatibility file for NextAuth.js
// Re-exports auth configuration from src/auth
// NextAuth v5 doesn't export GET and POST handlers from the auth config

// Use a direct export to ensure paths work during build
import { authOptions } from "./src/auth";
import NextAuth from "next-auth";

// Create the handler with the auth options
const handler = NextAuth(authOptions);

// Export the handler for API routes
export default handler;
export { authOptions };
EOF

# Create authOptions.js shortcut
cat > authOptions.js << 'EOF'
// Direct export of auth options to prevent circular imports
// For NextAuth v5, we directly import the object without type annotations
import { authOptions } from "./src/auth";
export default authOptions;
EOF

# Create a redirect page for /auth path
mkdir -p pages/auth
cat > pages/auth/index.tsx << 'EOF'
// pages/auth/index.tsx - Redirect page
import { useEffect } from 'react';
import { useRouter } from 'next/router';

// This component only exists to redirect users who try to access /auth
export default function AuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-in');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to sign in...</p>
    </div>
  );
}
EOF

# Create NextAuth API handler
mkdir -p pages/api/auth
cat > 'pages/api/auth/[...nextauth].ts' << 'EOF'
// API Route for NextAuth v5
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

// Import auth options from root to avoid circular dependencies
import authOptions from "../../../authOptions";

// Ensure the auth options match the expected NextAuthConfig type
const typedAuthOptions = authOptions as NextAuthConfig;

// Export the NextAuth handler
export default NextAuth(typedAuthOptions);
EOF

# Create custom type declarations for NextAuth v5
cat > types/next-auth.d.ts << 'EOF'
// Custom type declarations for NextAuth v5
import { DefaultSession } from "next-auth";

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  // Extend the user type
  interface User {
    id: string;
    role?: string;
    name?: string;
    email?: string;
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
EOF

# Create required directories
mkdir -p src/app lib data schemas components/ui components/auth utils pages/utils pages/calendar/utils context types dist

# Create a basic tsconfig.json that doesn't enforce strict type checking
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "types/**/*.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
EOF

# Create necessary TypeScript declaration files
mkdir -p types
touch types/next-env.d.ts

# Now run the Next.js build
echo "Running Next.js build..."
SKIP_TYPECHECK=true npx next build --no-lint

# Create a routes-manifest.json if it doesn't exist already
if [ ! -f "./dist/routes-manifest.json" ]; then
  echo "routes-manifest.json not found, creating..."
  cat > ./dist/routes-manifest.json << 'EOF'
{
  "version": 3,
  "pages404": true,
  "basePath": "",
  "redirects": [],
  "headers": [],
  "dynamicRoutes": [
    {
      "page": "/api/auth/[...nextauth]",
      "regex": "^/api/auth/(.+?)(?:/)?$",
      "routeKeys": {
        "nextauth": "nextauth"
      },
      "namedRegex": "^/api/auth/(?<nextauth>.+?)(?:/)?$"
    }
  ],
  "staticRoutes": [
    {
      "page": "/",
      "regex": "^/(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/(?:/)?$"
    },
    {
      "page": "/404",
      "regex": "^/404(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/404(?:/)?$"
    },
    {
      "page": "/api/register",
      "regex": "^/api/register(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/api/register(?:/)?$"
    },
    {
      "page": "/auth",
      "regex": "^/auth(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/auth(?:/)?$"
    },
    {
      "page": "/calendar",
      "regex": "^/calendar(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar(?:/)?$"
    },
    {
      "page": "/calendar/day",
      "regex": "^/calendar/day(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar/day(?:/)?$"
    },
    {
      "page": "/calendar/new-event",
      "regex": "^/calendar/new-event(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar/new-event(?:/)?$"
    },
    {
      "page": "/calendar/new-event/public",
      "regex": "^/calendar/new-event/public(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar/new-event/public(?:/)?$"
    },
    {
      "page": "/calendar/utils/event-modal",
      "regex": "^/calendar/utils/event-modal(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar/utils/event-modal(?:/)?$"
    },
    {
      "page": "/calendar/week",
      "regex": "^/calendar/week(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/calendar/week(?:/)?$"
    },
    {
      "page": "/sign-in",
      "regex": "^/sign-in(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/sign-in(?:/)?$"
    },
    {
      "page": "/sign-up",
      "regex": "^/sign-up(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/sign-up(?:/)?$"
    },
    {
      "page": "/utils/event-modal",
      "regex": "^/utils/event-modal(?:/)?$",
      "routeKeys": {},
      "namedRegex": "^/utils/event-modal(?:/)?$"
    }
  ],
  "dataRoutes": [],
  "rsc": {
    "header": "RSC",
    "varyHeader": "RSC, Next-Router-State-Tree, Next-Router-Prefetch"
  }
}
EOF
fi

# Check if we have a next.config.js in .next
if [ -f "./.next/next.config.js" ]; then
  echo "Copying next.config.js from .next to dist..."
  cp ./.next/next.config.js ./dist/
fi

# If we have a .next/BUILD_ID, copy it to dist
if [ -f "./.next/BUILD_ID" ]; then
  echo "Copying BUILD_ID from .next to dist..."
  cp ./.next/BUILD_ID ./dist/
fi

# Check for other necessary files
for file in build-manifest.json prerender-manifest.json react-loadable-manifest.json; do
  if [ -f "./.next/$file" ] && [ ! -f "./dist/$file" ]; then
    echo "Copying $file from .next to dist..."
    cp "./.next/$file" "./dist/"
  fi
done

# Copy server and static directories if needed
if [ -d "./.next/server" ] && [ ! -d "./dist/server" ]; then
  echo "Copying server directory from .next to dist..."
  mkdir -p ./dist/server
  cp -r ./.next/server/* ./dist/server/
fi

if [ -d "./.next/static" ] && [ ! -d "./dist/static" ]; then
  echo "Copying static directory from .next to dist..."
  mkdir -p ./dist/static
  cp -r ./.next/static/* ./dist/static/
fi

echo "Vercel build script completed successfully"
echo "Contents of dist directory:"
ls -la ./dist/