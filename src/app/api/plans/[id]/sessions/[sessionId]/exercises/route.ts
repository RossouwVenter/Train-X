import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

const createExerciseSchema = z.object({
  name: z.string().min(1),
  sets: z.number().int().min(1),
  reps: z.number().int().min(1),
  weight: z.number().optional(),
  duration: z.number().int().optional(),
  restPeriod: z.number().int().optional(),
  notes: z.string().optional(),
  order: z.number().int().min(0),
});

type RouteContext = { params: Promise<{ id: string; sessionId: string }> };

// POST /api/plans/[id]/sessions/[sessionId]/exercises — add exercise to session
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await authenticateRequest(request);
    if (!user || user.role !== "COACH") {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const { id: planId, sessionId } = await context.params;

    const body = await request.json();
    const parsed = createExerciseSchema.safeParse(body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
      return NextResponse.json({ error: "Validation failed", code: "VALIDATION_ERROR", details }, { status: 400 });
    }

    // Verify plan exists and coach owns it
    const plan = await prisma.trainingPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const coachProfile = await prisma.coachProfile.findUnique({ where: { userId: user.id } });
    if (!coachProfile || plan.coachId !== coachProfile.id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    // Verify session belongs to this plan
    const planSession = await prisma.planSession.findFirst({
      where: { id: sessionId, planId },
    });
    if (!planSession) {
      return NextResponse.json({ error: "Session not found in this plan", code: "NOT_FOUND" }, { status: 404 });
    }

    const { name, sets, reps, weight, duration, restPeriod, notes, order } = parsed.data;

    const exercise = await prisma.sessionExercise.create({
      data: {
        sessionId,
        name,
        sets,
        reps,
        weight: weight ?? null,
        duration: duration ?? null,
        restPeriod: restPeriod ?? null,
        notes: notes || null,
        order,
      },
    });

    return NextResponse.json({
      data: {
        id: exercise.id,
        sessionId: exercise.sessionId,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        duration: exercise.duration,
        restPeriod: exercise.restPeriod,
        notes: exercise.notes,
        order: exercise.order,
      },
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
