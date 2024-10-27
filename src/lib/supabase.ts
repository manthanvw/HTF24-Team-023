// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Get the current path
  const path = req.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path.startsWith("/auth/") ||
    path === "/" ||
    path === "/about" ||
    path === "/contact";
  // Add other public paths here

  // Handle authentication
  if (!session && !isPublicPath) {
    // Redirect to login page if accessing protected route without session
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    // Store the original URL to redirect back after login
    redirectUrl.searchParams.set("redirectedFrom", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Optional: Redirect logged-in users away from auth pages
  if (session && path.startsWith("/auth/")) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Configuration for middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - auth (auth pages)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|auth).*)",
  ],
};
