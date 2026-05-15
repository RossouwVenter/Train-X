import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-helpers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.MOBILE_JWT_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret"
);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse("Missing authorization header", "UNAUTHORIZED", 401);
    }

    const token = authHeader.slice(7);

    let payload;
    try {
      const result = await jwtVerify(token, JWT_SECRET);
      payload = result.payload as { id: string; email: string; name: string; role: string };
    } catch {
      return errorResponse("Invalid or expired token", "TOKEN_EXPIRED", 401);
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return errorResponse("User not found", "USER_NOT_FOUND", 401);
    }

    return NextResponse.json({
      data: { user },
    });
  } catch (error) {
    console.error("[MOBILE SESSION]", error);
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
