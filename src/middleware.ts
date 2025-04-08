import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Completely disabled middleware to avoid any auth dependencies
export function middleware(request: NextRequest) {
  // Let all requests through without any auth checks
  return NextResponse.next();
}

// Empty matcher to effectively disable middleware
export const config = {
  matcher: [],
};