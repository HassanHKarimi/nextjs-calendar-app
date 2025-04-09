import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-utils";

export async function middleware(request: NextRequest) {
  // For demo purposes, bypass all authentication checks
  // and let all routes through without authentication
  return NextResponse.next();
  
  /* Original authentication logic:
  const token = await getToken({ 
    req: request,
    secret: getAuthSecret() 
  });
  const pathname = request.nextUrl.pathname;

  // Auth routes - redirect to calendar if authenticated
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  if (isAuthRoute) {
    if (token) {
      return NextResponse.redirect(new URL("/calendar", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - redirect to sign-in if not authenticated
  const isProtectedRoute = pathname.startsWith("/calendar");
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
  */
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Authentication routes
    "/sign-in/:path*",
    "/sign-up/:path*",
    // Protected routes
    "/calendar/:path*",
  ],
};
