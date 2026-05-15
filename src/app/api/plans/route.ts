import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

const createPlanSchema = z.object({
  athleteId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  weekStartDate: z.string().min(1),
  status: z.enum(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
});

// GET /api/plans?athleteId=xxx — list plans for an athlete
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const athleteId = searchParams.get("athleteId");

    if (!athleteId) {
      return NextResponse.json({ error: "athleteId is required", code: "VALIDATION_ERROR" }, { status: 400 });
    }

    // Authorization check
    if (user.role === "COACH") {
      const coachProfile = await prisma.coachProfile.findUnique({
        where: { userId: user.id },
      });
      if (!coachProfile) {
        return NextResponse.json({ error: "Coach profile not found", code: "NOT_FOUND" }, { status: 404 });
      }
      const athlete = await prisma.athleteProfile.findFirst({
        where: { id: athleteId, coachId: coachProfile.id },
      });
      if (!athlete) {
        return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
      }
    } else if (user.role === "ATHLETE") {
      const profile = await prisma.athleteProfile.findUnique({
        where: { userId: user.id },
      });
      if (!profile || profile.id !== athleteId) {
        return NextResponse.json({ error: "Forbidden", code: "FORBIDDEN" }, { status: 403 });
      }
    }

    const plans = await prisma.trainingPlan.findMany({
      where: { athleteId },
      orderBy: { weekStartDate: "desc" },
    });

    return NextResponse.json({
      data: plans.map((p) => ({
        id: p.id,
        athleteId: p.athleteId,
        coachId: p.coachId,
        name: p.name,
        description: p.description,
        weekStartDate: p.weekStartDate.toISOString(),
        status: p.status,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Can't reach database")) {
      return NextResponse.json({ error: "Database unreachable", code: "DB_UNREACHABLE" }, { status: 503 });
    }
    return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}

// POST /api/plans — create a new plan (coach only)
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user || user.role !== "COACH") {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createPlanSchema.safeParse(body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
      return NextResponse.json({ error: "Validation failed", code: "VALIDATION_ERROR", details }, { status: 400 });
    }

    const { athleteId, name, description, weekStartDate, status } = parsed.data;

    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: user.id },
    });
    if (!coachProfile) {
      return NextResponse.json({ error: "Coach profile not found", code: "NOT_FOUND" }, { status: 404 });
    }

    // Verify the athlete belongs to this coach
    const athlete = await prisma.athleteProfile.findFirst({
      where: { id: athleteId, coachId: coachProfile.id },
    });
    if (!athlete) {
      return NextResponse.json({ error: "Athlete not found or not yours", code: "FORBIDDEN" }, { status: 403 });
    }

    const plan = await prisma.trainingPlan.create({
      data: {
        athleteId,
        coachId: coachProfile.id,
        name,
        description: description || null,
        weekStartDate: new Date(weekStartDate),
        status: status || "DRAFT",
      },
    });

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
