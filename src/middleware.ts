import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const publicRoutes = ["/", "/login", "/register", "/reset-password"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  console.log("[MIDDLEWARE]", pathname, "auth:", req.auth ? `user=${req.auth.user?.email} role=${req.auth.user?.role}` : "no session");

  // Allow public routes, auth API, and admin API
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  const token = req.auth;

  // Redirect unauthenticated users to login
  if (!token) {
    console.log("[MIDDLEWARE] No token, redirecting to /login from:", pathname);
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.user?.role as string;

  // Protect /coach routes — COACH only
  if (pathname.startsWith("/coach") && role !== "COACH") {
    return NextResponse.redirect(new URL("/athlete", req.nextUrl.origin));
  }

  // Protect /athlete routes — ATHLETE only
  if (pathname.startsWith("/athlete") && role !== "ATHLETE") {
    return NextResponse.redirect(new URL("/coach", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
