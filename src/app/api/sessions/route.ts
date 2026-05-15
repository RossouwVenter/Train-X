import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

// GET /api/sessions?athleteId=xxx&weekStart=2026-05-12
// Returns sessions for an athlete for a specific week
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let athleteProfileId = searchParams.get("athleteId");
    const weekStartStr = searchParams.get("weekStart");

    // If athlete requests their own sessions
    if (athleteProfileId === "me" && user.role === "ATHLETE") {
      const profile = await prisma.athleteProfile.findUnique({
        where: { userId: user.id },
      });
      if (!profile) {
        return NextResponse.json({ data: { planId: null, sessions: [] } });
      }
      athleteProfileId = profile.id;
    }

    if (!athleteProfileId || !weekStartStr) {
      return NextResponse.json(
        { error: "athleteId and weekStart are required" },
        { status: 400 }
      );
    }

    // Authorization: coaches can only view their own athletes' sessions
    if (user.role === "COACH") {
      const coachProfile = await prisma.coachProfile.findUnique({
        where: { userId: user.id },
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

    const weekStart = new Date(weekStartStr);
    weekStart.setHours(0, 0, 0, 0);

    // Find the training plan for this athlete and week
    const plan = await prisma.trainingPlan.findFirst({
      where: {
        athleteId: athleteProfileId,
        weekStartDate: weekStart,
      },
      include: {
        sessions: {
          include: { exercises: { orderBy: { order: "asc" } } },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!plan) {
      return NextResponse.json({ data: { planId: null, sessions: [] } });
    }

    const sessions = plan.sessions.map((s) => ({
      id: s.id,
      dayOfWeek: s.dayOfWeek,
      title: s.title,
      type: s.type,
      notes: s.notes,
      order: s.order,
      exercises: s.exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        duration: ex.duration,
        restPeriod: ex.restPeriod,
        notes: ex.notes,
        order: ex.order,
      })),
    }));

    return NextResponse.json({ data: { planId: plan.id, sessions } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/sessions — create or update sessions for a week
// Body: { athleteId, weekStart, sessions: [{ dayOfWeek, title, type, notes, workout }] }
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "COACH") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { athleteId, weekStart, sessions } = body;

    if (!athleteId || !weekStart || !sessions) {
      return NextResponse.json(
        { error: "athleteId, weekStart, and sessions are required" },
        { status: 400 }
      );
    }

    const weekStartDate = new Date(weekStart);
    weekStartDate.setHours(0, 0, 0, 0);

    // Get coach profile
    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!coachProfile) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    // Verify athlete belongs to this coach
    const athleteProfile = await prisma.athleteProfile.findFirst({
      where: { id: athleteId, coachId: coachProfile.id },
    });

    if (!athleteProfile) {
      return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
    }

    // Find or create the training plan for this week
    let plan = await prisma.trainingPlan.findFirst({
      where: {
        athleteId,
        coachId: coachProfile.id,
        weekStartDate: weekStartDate,
      },
    });

    if (!plan) {
      plan = await prisma.trainingPlan.create({
        data: {
          athleteId,
          coachId: coachProfile.id,
          name: `Week of ${weekStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          weekStartDate: weekStartDate,
          status: "ACTIVE",
        },
      });
    }

    // Delete existing sessions for this plan and recreate (transactional)
    await prisma.$transaction(async (tx) => {
      await tx.planSession.deleteMany({ where: { planId: plan!.id } });

      for (let i = 0; i < sessions.length; i++) {
        const s = sessions[i];
        await tx.planSession.create({
          data: {
            planId: plan!.id,
            dayOfWeek: s.dayOfWeek,
            title: s.title,
            type: s.type || "General",
            order: i,
            notes: s.notes || s.workout || null,
            exercises: s.exercises
              ? {
                  create: s.exercises.map((ex: { name: string; sets?: number; reps?: number; weight?: number; duration?: number; restPeriod?: number; notes?: string }, idx: number) => ({
                    name: ex.name,
                    sets: ex.sets || 1,
                    reps: ex.reps || 1,
                    weight: ex.weight || null,
                    duration: ex.duration || null,
                    restPeriod: ex.restPeriod || null,
                    notes: ex.notes || null,
                    order: idx,
                  })),
                }
              : undefined,
          },
        });
      }
    });

    // Return the updated plan
    const updatedPlan = await prisma.trainingPlan.findUnique({
      where: { id: plan.id },
      include: {
        sessions: {
          include: { exercises: { orderBy: { order: "asc" } } },
          orderBy: { order: "asc" },
        },
      },
    });

    const result = updatedPlan!.sessions.map((s) => ({
      id: s.id,
      dayOfWeek: s.dayOfWeek,
      title: s.title,
      type: s.type,
      notes: s.notes,
      order: s.order,
      exercises: s.exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        duration: ex.duration,
        restPeriod: ex.restPeriod,
        notes: ex.notes,
        order: ex.order,
      })),
    }));

    return NextResponse.json({ data: { planId: plan.id, sessions: result } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    console.error("[SESSIONS POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/sessions — delete a single session
// Body: { sessionId }
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "COACH") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    // Verify the session belongs to a plan under this coach
    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!coachProfile) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    const planSession = await prisma.planSession.findUnique({
      where: { id: sessionId },
      include: { plan: true },
    });

    if (!planSession || planSession.plan.coachId !== coachProfile.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    await prisma.planSession.delete({ where: { id: sessionId } });

    return NextResponse.json({ message: "Session deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
