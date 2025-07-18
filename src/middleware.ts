import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("Middleware executed for:", pathname);

  // Check for session token in cookies (NextAuth uses different cookie names)
  const sessionToken =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  console.log("Session token exists:", !!sessionToken, "for path:", pathname);

  // If we have a session token and user is trying to access signin page, redirect to dashboard
  if (sessionToken && pathname.startsWith("/auth/signin")) {
    const callbackUrl =
      req.nextUrl.searchParams.get("callbackUrl") || "/dashboard";
    console.log("Redirecting authenticated user from signin to:", callbackUrl);
    return NextResponse.redirect(new URL(callbackUrl, req.url));
  }

  // Check if the route requires authentication
  if (isProtectedRoute(pathname) && !sessionToken) {
    console.log("Redirecting unauthenticated user to signin for:", pathname);
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ["/dashboard", "/tutorials", "/practice", "/quizzes"];
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tutorials/:path*",
    "/practice/:path*",
    "/quizzes/:path*",
    "/auth/signin",
    "/auth/signin/:path*",
    // Catch all auth routes
    "/auth/:path*",
  ],
};
