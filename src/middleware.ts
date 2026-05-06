import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes and auth API
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Redirect unauthenticated users to login
  if (!token) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string;

  // Protect /coach routes — COACH only
  if (pathname.startsWith("/coach") && role !== "COACH") {
    return NextResponse.redirect(new URL("/athlete", req.nextUrl.origin));
  }

  // Protect /athlete routes — ATHLETE only
  if (pathname.startsWith("/athlete") && role !== "ATHLETE") {
    return NextResponse.redirect(new URL("/coach", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
