import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/athletes — list athletes for the authenticated coach
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "COACH") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        athletes: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
      },
    });

    if (!coachProfile) {
      return NextResponse.json({ data: [] });
    }

    const athletes = coachProfile.athletes.map((a) => ({
      id: a.id,
      userId: a.user.id,
      name: a.user.name,
      email: a.user.email,
      sport: a.sport || "Not specified",
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json({ data: athletes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/athletes — create a new athlete under the authenticated coach
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "COACH") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, sport } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!coachProfile) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // Check if they already have an athlete profile
      const existingProfile = await prisma.athleteProfile.findUnique({
        where: { userId: existingUser.id },
      });

      if (existingProfile) {
        return NextResponse.json(
          { error: "This user is already an athlete" },
          { status: 409 }
        );
      }

      // Create athlete profile for existing user
      const athleteProfile = await prisma.athleteProfile.create({
        data: {
          userId: existingUser.id,
          coachId: coachProfile.id,
          sport: sport || null,
        },
      });

      return NextResponse.json({
        data: {
          id: athleteProfile.id,
          userId: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          sport: sport || "Not specified",
          createdAt: athleteProfile.createdAt.toISOString(),
        },
      }, { status: 201 });
    }

    // Create new user + athlete profile
    const bcrypt = await import("bcryptjs");
    const tempPassword = crypto.randomUUID().slice(0, 12);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "ATHLETE",
        athleteProfile: {
          create: {
            coachId: coachProfile.id,
            sport: sport || null,
          },
        },
      },
      include: { athleteProfile: true },
    });

    return NextResponse.json({
      data: {
        id: newUser.athleteProfile!.id,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        sport: sport || "Not specified",
        createdAt: newUser.athleteProfile!.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/athletes — remove an athlete (deletes user + profile)
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "COACH") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { athleteProfileId } = await request.json();

    if (!athleteProfileId) {
      return NextResponse.json({ error: "athleteProfileId is required" }, { status: 400 });
    }

    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!coachProfile) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    // Verify the athlete belongs to this coach
    const athleteProfile = await prisma.athleteProfile.findFirst({
      where: { id: athleteProfileId, coachId: coachProfile.id },
    });

    if (!athleteProfile) {
      return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
    }

    // Delete the user (cascades to athlete profile, plans, logs, etc.)
    await prisma.user.delete({
      where: { id: athleteProfile.userId },
    });

    return NextResponse.json({ message: "Athlete removed" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
