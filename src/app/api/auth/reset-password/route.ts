import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const resetSchema = z.object({
  email: z.string().email("Invalid email format"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = resetSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { email, newPassword } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether the email exists
      return NextResponse.json(
        { message: "If an account with that email exists, the password has been reset." },
        { status: 200 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    return NextResponse.json(
      { message: "If an account with that email exists, the password has been reset." },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Database is currently unreachable.", code: "DB_UNREACHABLE" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
