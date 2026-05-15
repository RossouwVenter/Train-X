import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

const updatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/plans/[id] — get plan with sessions + exercises
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const { id } = await context.params;

    const plan = await prisma.trainingPlan.findUnique({
      where: { id },
      include: {
        sessions: {
          include: { exercises: { orderBy: { order: "asc" } } },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found", code: "NOT_FOUND" }, { status: 404 });
    }

    // Verify ownership
    if (user.role === "COACH") {
      const coachProfile = await prisma.coachProfile.findUnique({ where: { userId: user.id } });
      if (!coachProfile || plan.coachId !== coachProfile.id) {
        return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
      }
    } else if (user.role === "ATHLETE") {
      const profile = await prisma.athleteProfile.findUnique({ where: { userId: user.id } });
      if (!profile || plan.athleteId !== profile.id) {
        return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
      }
    }

    return NextResponse.json({
      data: {
        id: plan.id,
        athleteId: plan.athleteId,
        coachId: plan.coachId,
        name: plan.name,
        description: plan.description,
        weekStartDate: plan.weekStartDate.toISOString(),
        status: plan.status,
        createdAt: plan.createdAt.toISOString(),
        updatedAt: plan.updatedAt.toISOString(),
        sessions: plan.sessions.map((s) => ({
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
        })),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}

// PUT /api/plans/[id] — update plan (name, description, status)
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await authenticateRequest(request);
    if (!user || user.role !== "COACH") {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const { id } = await context.params;

    const body = await request.json();
    const parsed = updatePlanSchema.safeParse(body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
      return NextResponse.json({ error: "Validation failed", code: "VALIDATION_ERROR", details }, { status: 400 });
    }

    const plan = await prisma.trainingPlan.findUnique({ where: { id } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const coachProfile = await prisma.coachProfile.findUnique({ where: { userId: user.id } });
    if (!coachProfile || plan.coachId !== coachProfile.id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const updated = await prisma.trainingPlan.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({
      data: {
        id: updated.id,
        athleteId: updated.athleteId,
        coachId: updated.coachId,
        name: updated.name,
        description: updated.description,
        weekStartDate: updated.weekStartDate.toISOString(),
        status: updated.status,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}

// DELETE /api/plans/[id] — delete plan (coach only)
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await authenticateRequest(request);
    if (!user || user.role !== "COACH") {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const { id } = await context.params;

    const plan = await prisma.trainingPlan.findUnique({ where: { id } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const coachProfile = await prisma.coachProfile.findUnique({ where: { userId: user.id } });
    if (!coachProfile || plan.coachId !== coachProfile.id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    await prisma.trainingPlan.delete({ where: { id } });

    return NextResponse.json({ data: { message: "Plan deleted" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
