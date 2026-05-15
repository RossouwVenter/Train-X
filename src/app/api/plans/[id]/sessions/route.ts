import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

const createSessionSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  title: z.string().min(1),
  type: z.string().min(1),
  notes: z.string().optional(),
  order: z.number().int().min(0),
});

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/plans/[id]/sessions — add session to plan
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await authenticateRequest(request);
    if (!user || user.role !== "COACH") {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const { id: planId } = await context.params;

    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
      return NextResponse.json({ error: "Validation failed", code: "VALIDATION_ERROR", details }, { status: 400 });
    }

    const plan = await prisma.trainingPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const coachProfile = await prisma.coachProfile.findUnique({ where: { userId: user.id } });
    if (!coachProfile || plan.coachId !== coachProfile.id) {
      return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
    }

    const { dayOfWeek, title, type, notes, order } = parsed.data;

    const session = await prisma.planSession.create({
      data: {
        planId,
        dayOfWeek,
        title,
        type,
        notes: notes || null,
        order,
      },
    });

    return NextResponse.json({
      data: {
        id: session.id,
        planId: session.planId,
        dayOfWeek: session.dayOfWeek,
        title: session.title,
        type: session.type,
        notes: session.notes,
        order: session.order,
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
