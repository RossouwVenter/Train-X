import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["COACH", "ATHLETE"], {
    errorMap: () => ({ message: "Role must be COACH or ATHLETE" }),
  }),
  coachId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.errors[0].message,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    const { email, password, name, role, coachId } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists", code: "USER_EXISTS" },
        { status: 409 }
      );
    }

    if (role === "ATHLETE" && coachId) {
      const coachProfile = await prisma.coachProfile.findUnique({
        where: { id: coachId },
      });

      if (!coachProfile) {
        return NextResponse.json(
          { error: "Coach not found", code: "COACH_NOT_FOUND" },
          { status: 404 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        coachProfile:
          role === "COACH" ? { create: {} } : undefined,
        athleteProfile:
          role === "ATHLETE" && coachId
            ? { create: { coachId } }
            : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Database is currently unreachable. Please check your network connection and try again.", code: "DB_UNREACHABLE" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
