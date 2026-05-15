import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { errorResponse, validationErrorResponse } from "@/lib/api-helpers";
import { SignJWT } from "jose";
import { z } from "zod";

const JWT_SECRET = new TextEncoder().encode(
  process.env.MOBILE_JWT_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret"
);

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["COACH", "ATHLETE"], {
    errorMap: () => ({ message: "Role must be COACH or ATHLETE" }),
  }),
  coachId: z.string().optional(),
});

async function createToken(user: { id: string; email: string; name: string; role: string }) {
  return new SignJWT({ id: user.id, email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, password, name, role, coachId } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return errorResponse("A user with this email already exists", "USER_EXISTS", 409);
    }

    if (role === "ATHLETE" && coachId) {
      const coachProfile = await prisma.coachProfile.findUnique({
        where: { id: coachId },
      });

      if (!coachProfile) {
        return errorResponse("Coach not found", "COACH_NOT_FOUND", 404);
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        coachProfile: role === "COACH" ? { create: {} } : undefined,
        athleteProfile:
          role === "ATHLETE" && coachId ? { create: { coachId } } : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json(
      {
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return errorResponse("Database is currently unreachable", "DB_UNREACHABLE", 503);
    }
    return errorResponse("Internal server error", "INTERNAL_ERROR", 500);
  }
}
