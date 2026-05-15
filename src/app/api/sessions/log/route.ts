import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/sessions/log — athlete logs a completed session
// Body: { sessionId, rpe, mood, notes }
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ATHLETE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, rpe, mood, notes } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const athleteProfile = await prisma.athleteProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!athleteProfile) {
      return NextResponse.json({ error: "Athlete profile not found" }, { status: 404 });
    }

    // Verify the session belongs to a plan assigned to this athlete
    const planSession = await prisma.planSession.findUnique({
      where: { id: sessionId },
      include: { plan: true },
    });

    if (!planSession || planSession.plan.athleteId !== athleteProfile.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check for existing log
    const existingLog = await prisma.sessionLog.findFirst({
      where: { sessionId, athleteId: athleteProfile.id },
    });

    if (existingLog) {
      // Update existing log
      const updated = await prisma.sessionLog.update({
        where: { id: existingLog.id },
        data: {
          rpe: rpe || null,
          mood: mood || null,
          notes: notes || null,
          completedAt: new Date(),
        },
      });
      return NextResponse.json({ data: updated });
    }

    // Create new log
    const log = await prisma.sessionLog.create({
      data: {
        sessionId,
        athleteId: athleteProfile.id,
        userId: session.user.id,
        completedAt: new Date(),
        rpe: rpe || null,
        mood: mood || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ data: log }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/sessions/log?athleteId=xxx&weekStart=2026-05-12
// Returns session logs for an athlete for a specific week
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let athleteProfileId = searchParams.get("athleteId");
    const weekStartStr = searchParams.get("weekStart");

    // If athlete role, use their own profile
    if (session.user.role === "ATHLETE") {
      const profile = await prisma.athleteProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      athleteProfileId = profile.id;
    }

    if (!athleteProfileId) {
      return NextResponse.json({ error: "athleteId is required" }, { status: 400 });
    }

    // Authorization: coaches can only view their own athletes' logs
    if (session.user.role === "COACH") {
      const coachProfile = await prisma.coachProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (!coachProfile) {
        return NextResponse.json({ error: "Coach profile not found" }, { status: 403 });
      }
      const athleteBelongsToCoach = await prisma.athleteProfile.findFirst({
        where: { id: athleteProfileId, coachId: coachProfile.id },
      });
      if (!athleteBelongsToCoach) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const where: Record<string, unknown> = { athleteId: athleteProfileId };

    if (weekStartStr) {
      const weekStart = new Date(weekStartStr);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      where.completedAt = { gte: weekStart, lt: weekEnd };
    }

    const logs = await prisma.sessionLog.findMany({
      where,
      include: { session: true },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json({
      data: logs.map((l) => ({
        id: l.id,
        sessionId: l.sessionId,
        sessionTitle: l.session.title,
        completedAt: l.completedAt.toISOString(),
        rpe: l.rpe,
        mood: l.mood,
        notes: l.notes,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
