// Root middleware - simplified to avoid dependency issues
import { NextResponse } from "next/server";

// Simple middleware function to pass through all requests
export default function middleware() {
  return NextResponse.next();
}

// Configure minimal matcher to ensure the middleware doesn't run 
// where it's not needed
export const config = {
  matcher: []
};