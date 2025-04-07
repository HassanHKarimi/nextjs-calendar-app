import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/sign-in") || 
                    req.nextUrl.pathname.startsWith("/sign-up") || 
                    req.nextUrl.pathname.startsWith("/error");

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/calendar", req.nextUrl.origin));
  }

  // Allow public access to auth pages
  return NextResponse.next();
});

// Match all paths except for API, static, and specific public paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
