import { auth } from "./auth";

// This function runs for protected routes
export default auth((req) => {
  // Make sure users are logged in to access /calendar
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isCalendarPath = nextUrl.pathname.startsWith("/calendar");
  const isAuthPath = nextUrl.pathname.startsWith("/sign-in") || 
                    nextUrl.pathname.startsWith("/sign-up");

  if (isCalendarPath && !isLoggedIn) {
    return Response.redirect(new URL("/sign-in", nextUrl));
  }

  if (isAuthPath && isLoggedIn) {
    return Response.redirect(new URL("/calendar", nextUrl));
  }
});

// Match all paths except for API, static, and specific public paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
