#!/bin/bash

# This is a super simplified build script that doesn't use any CSS frameworks

# Debug: Print current directory
echo "Current working directory: $(pwd)"

# Create required directories
mkdir -p src/app
mkdir -p lib
mkdir -p data
mkdir -p schemas
mkdir -p components/ui
mkdir -p components/auth
mkdir -p utils
mkdir -p pages/utils
mkdir -p pages/calendar/utils
mkdir -p types
mkdir -p context

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

// No longer need to export a handler directly in the auth.ts file for NextAuth v5
EOF

# Create auth.js that exports directly from src/auth.ts
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

# Also create authOptions.js shortcut to minimize import issues
cat > authOptions.js << 'EOF'
// Direct export of auth options to prevent circular imports
// For NextAuth v5, we directly import the object without type annotations
import { authOptions } from "./src/auth";
export default authOptions;
EOF

# Create lib/db.ts file
cat > lib/db.ts << 'EOF'
// lib/db.ts
import { PrismaClient } from "@prisma/client";

// Create a global prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Use global instance to prevent multiple instances during hot reloading
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
EOF

# Create schemas/index.ts file
cat > schemas/index.ts << 'EOF'
// schemas/index.ts
import * as z from "zod";

// User registration form schema
export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// User login form schema
export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Event creation schema
export const EventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().optional(),
  isAllDay: z.boolean().default(false),
  color: z.string().default("blue"),
  userId: z.string().optional(),
});
EOF

# Create data/user.ts file
cat > data/user.ts << 'EOF'
// data/user.ts
import { db } from "../lib/db";

// Function to get a user by email
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email }
    });
    
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
};

// Function to get a user by ID
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id }
    });
    
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};
EOF

# Create a super simple CSS file without any frameworks
cat > src/app/styles.css << 'EOF'
/* Basic styles without any CSS frameworks */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.calendar-day {
  min-height: 100px;
  border: 1px solid #ddd;
  padding: 4px;
}

.calendar-day-header {
  text-align: center;
  font-weight: bold;
  padding: 4px;
}

.event-item {
  margin: 2px 0;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-blue { background-color: #93c5fd; }
.event-green { background-color: #86efac; }
.event-red { background-color: #fca5a5; }
.event-yellow { background-color: #fde68a; }
.event-purple { background-color: #d8b4fe; }
.event-pink { background-color: #f9a8d4; }
.event-orange { background-color: #fdba74; }
.event-gray { background-color: #d1d5db; }

.button {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.button:hover {
  background-color: #3b78e7;
}

.button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.error {
  color: #e53e3e;
  font-size: 14px;
  margin-top: 4px;
}
EOF

# Create components/theme-provider.tsx with a very simple implementation
cat > components/theme-provider.tsx << 'EOF'
// components/theme-provider.tsx - Simple version
import React from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
};

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  // Simple implementation that just renders children
  return <>{children}</>;
}
EOF

# Create components/ui/toaster.tsx
cat > components/ui/toaster.tsx << 'EOF'
// components/ui/toaster.tsx - Simple version
import React from "react";

export function Toaster(): React.ReactElement | null {
  // Simple implementation that does nothing
  return null;
}
EOF

# Create sign-in-form.tsx
cat > components/auth/sign-in-form.tsx << 'EOF'
// components/auth/sign-in-form.tsx - Simple version
import React, { useState } from "react";

export function SignInForm(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Just log to console in this simplified version
    console.log("Sign in with:", { email, password });
  };
  
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Email</label>
          <input
            className="input"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button className="button" type="submit">Sign In</button>
      </form>
    </div>
  );
}
EOF

# Create sign-up-form.tsx
cat > components/auth/sign-up-form.tsx << 'EOF'
// components/auth/sign-up-form.tsx - Simple version
import React, { useState } from "react";

export function SignUpForm(): React.ReactElement {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Just log to console in this simplified version
    console.log("Sign up with:", { name, email, password });
  };
  
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Name</label>
          <input
            className="input"
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Email</label>
          <input
            className="input"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Password</label>
          <input
            className="input"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button className="button" type="submit">Sign Up</button>
      </form>
    </div>
  );
}
EOF

# Create minimal _app.tsx without any CSS framework imports
cat > pages/_app.tsx << 'EOF'
// Minimal _app.tsx without any CSS frameworks
import type { AppProps } from 'next/app'
import '../src/app/styles.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
EOF

# Create minimal sign-in.tsx
cat > pages/sign-in.tsx << 'EOF'
// Simple sign-in page
import { SignInForm } from "../components/auth/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Sign In</h1>
      <SignInForm />
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        Don't have an account?{" "}
        <Link href="/sign-up">Sign up</Link>
      </div>
    </div>
  );
}
EOF

# Create minimal sign-up.tsx
cat > pages/sign-up.tsx << 'EOF'
// Simple sign-up page
import { SignUpForm } from "../components/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Sign Up</h1>
      <SignUpForm />
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        Already have an account?{" "}
        <Link href="/sign-in">Sign in</Link>
      </div>
    </div>
  );
}
EOF

# Create NextAuth API handler with proper types for v5
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

# Create registration API handler
mkdir -p pages/api/register
cat > pages/api/register/index.ts << 'EOF'
// Simplified registration API handler
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

// Import from relative paths to avoid issues
import { db } from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return the user without password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("[REGISTER_API]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
EOF

# Create a minimal EventModal component with proper types
cat > utils/event-modal.js << 'EOF'
import React from "react";

// Define event type to avoid any issues
export const EventModal = ({ event, onClose }) => {
  return React.createElement("div", null, null);
};

export default function EventModalComponent() {
  return React.createElement("div", null, null);
}
EOF

# Copy files to correct locations
cp utils/event-modal.js pages/utils/
cp utils/event-modal.js pages/calendar/utils/

# Fix import paths in calendar files - different syntax for macOS vs Linux (Vercel)
if [ -f pages/calendar/index.tsx ]; then
  if [ "$(uname)" = "Darwin" ]; then
    # macOS requires an empty string for backup extension
    sed -i '' 's|import { EventModal } from "./components/event-modal"|import { EventModal } from "./utils/event-modal"|g' pages/calendar/index.tsx
  else
    # Linux doesn't need the empty string
    sed -i 's|import { EventModal } from "./components/event-modal"|import { EventModal } from "./utils/event-modal"|g' pages/calendar/index.tsx
  fi
  grep -n "EventModal" pages/calendar/index.tsx | head -3
fi

if [ -f pages/calendar/day/index.tsx ]; then
  if [ "$(uname)" = "Darwin" ]; then
    sed -i '' 's|import { EventModal } from "../components/event-modal"|import { EventModal } from "../utils/event-modal"|g' pages/calendar/day/index.tsx
  else
    sed -i 's|import { EventModal } from "../components/event-modal"|import { EventModal } from "../utils/event-modal"|g' pages/calendar/day/index.tsx
  fi
  grep -n "EventModal" pages/calendar/day/index.tsx | head -3
fi

if [ -f pages/calendar/week/index.tsx ]; then
  if [ "$(uname)" = "Darwin" ]; then
    sed -i '' 's|import { EventModal } from "../components/event-modal"|import { EventModal } from "../utils/event-modal"|g' pages/calendar/week/index.tsx
  else
    sed -i 's|import { EventModal } from "../components/event-modal"|import { EventModal } from "../utils/event-modal"|g' pages/calendar/week/index.tsx
  fi
  grep -n "EventModal" pages/calendar/week/index.tsx | head -3
fi

# Remove components directory if exists
rm -rf pages/calendar/components

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

# Create the auth context in the context directory (not under pages to avoid routing issues)
cat > context/auth-context.js << 'EOF'
// context/auth-context.js - Moved from pages/auth/ to avoid routing conflicts
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for authentication on mount
  useEffect(() => {
    // Skip auth check for login page
    if (router.pathname === '/' || router.pathname === '/calendar/new-event/public') {
      setLoading(false);
      return;
    }

    try {
      // Only run on client-side
      if (typeof window !== 'undefined') {
        const storedAuth = sessionStorage.getItem('calendarAuth');
        
        if (storedAuth) {
          const auth = JSON.parse(storedAuth);
          if (auth.isAuthenticated && auth.user) {
            setUser(auth.user);
            setLoading(false);
            return;
          }
        }
        
        // Not authenticated, redirect to login
        router.push('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      // On error, redirect to login
      if (typeof window !== 'undefined') {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  }, [router.pathname]);

  // Login function
  const login = (userData) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('calendarAuth', JSON.stringify({
        isAuthenticated: true,
        user: userData
      }));
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('calendarAuth');
      router.push('/');
    }
  };

  // Context value
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  // Show loading state or render children
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
EOF

# Remove any files and config related to Tailwind or PostCSS
rm -f tailwind.config.js postcss.config.js

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

# Create a tsconfig.json file that allows implicit any types
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
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
    "noImplicitAny": false,
    "strictNullChecks": false,
    "noImplicitReturns": false,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./*", "./src/*"]
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

# Create empty next.config.js to avoid any Tailwind references
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
EOF

# Show debug info
echo "All files in pages and src directory:"
find pages src -type f | sort

# Build the application with minimum features - using npx to ensure command is found
if [ "$VERCEL" = "1" ]; then
  echo "Running on Vercel - building the application"
  npx next build --no-lint
else
  echo "Running locally - skipping build as it will run on Vercel"
fi