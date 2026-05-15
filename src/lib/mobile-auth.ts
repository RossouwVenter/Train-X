import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { auth } from "@/lib/auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.MOBILE_JWT_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret"
);

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

/**
 * Dual auth: checks Bearer token first, falls back to NextAuth cookie session.
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthUser | null> {
  // 1. Check for Bearer token
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const { id, email, name, role } = payload as unknown as AuthUser;
      if (id && email && name && role) {
        return { id, email, name, role };
      }
    } catch {
      // Invalid token — don't fall back, return null
      return null;
    }
  }

  // 2. Fall back to NextAuth cookie-based session
  const session = await auth();
  if (session?.user?.id && session.user.email && session.user.name && session.user.role) {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };
  }

  return null;
}
