import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware protects routes and handles authentication redirects
export default async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Auth routes - redirect to calendar if authenticated
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  if (isAuthRoute) {
    if (session?.user) {
      return NextResponse.redirect(new URL("/calendar", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - redirect to sign-in if not authenticated
  const isProtectedRoute = pathname.startsWith("/calendar");
  if (isProtectedRoute) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Authentication routes
    "/sign-in/:path*",
    "/sign-up/:path*",
    // Protected routes
    "/calendar/:path*",
    // API routes except auth endpoints (so NextAuth can handle them)
    "/api/(.(?!auth))*",
  ],
};
