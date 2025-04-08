import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simplified middleware that doesn't depend on next-auth
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Simplified handling
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    // We'll let the client-side handle auth redirects
    return NextResponse.next();
  }

  // For now, let all requests through to avoid build issues
  return NextResponse.next();
}

// Define which paths the middleware applies to
export const config = {
  matcher: [
    // Auth routes
    "/sign-in/:path*",
    "/sign-up/:path*",
    // Protected routes 
    "/calendar/:path*",
  ],
};