import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware for authentication protection and redirects
 * This runs before requests to protected routes to ensure authentication
 */
export async function middleware(request: NextRequest) {
  // Get the NextAuth token (if user is logged in)
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  });
  
  const pathname = request.nextUrl.pathname;

  // Auth routes - redirect to calendar if already authenticated
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    if (token) {
      return NextResponse.redirect(new URL("/calendar", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - redirect to sign-in if not authenticated
  if (pathname.startsWith("/calendar")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * Define which paths the middleware applies to
 * Explicitly exclude API routes to avoid interference
 */
export const config = {
  matcher: [
    // Auth routes
    "/sign-in/:path*",
    "/sign-up/:path*",
    // Protected routes
    "/calendar/:path*",
  ],
};
