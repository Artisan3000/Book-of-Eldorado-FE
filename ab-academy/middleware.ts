import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./src/lib/session-cookie";
import { isProtectedRoute } from "./src/lib/protected-routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/instructor/:path*",
    "/member/:path*",
    "/student/:path*",
  ],
};
