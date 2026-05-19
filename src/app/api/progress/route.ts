import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

// GET /api/progress?athleteId=xxx&range=week|month|all
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const athleteId = searchParams.get("athleteId");
    const range = searchParams.get("range") || "month";

    if (!athleteId) {
      return NextResponse.json({ error: "athleteId is required" }, { status: 400 });
    }

    // Determine date range
    const now = new Date();
    let since: Date;
    if (range === "week") {
      since = new Date(now);
      since.setDate(since.getDate() - 7);
    } else if (range === "all") {
      since = new Date(0);
    } else {
      // default: month (4 weeks)
      since = new Date(now);
      since.setDate(since.getDate() - 28);
    }

    // Get athlete profile
    const profile = await prisma.athleteProfile.findUnique({
      where: { id: athleteId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
    }

    // Authorization: athlete themselves or their coach
    if (user.role === "ATHLETE" && profile.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all plans for this athlete
    const plans = await prisma.trainingPlan.findMany({
      where: { athleteId, status: "ACTIVE" },
      include: {
        sessions: true,
      },
    });

    const totalSessionsInPlans = plans.reduce(
      (sum, p) => sum + p.sessions.length,
      0
    );

    // Get session logs in range
    const logs = await prisma.sessionLog.findMany({
      where: {
        athleteId,
        completedAt: { gte: since },
      },
      orderBy: { completedAt: "asc" },
    });

    const completedCount = logs.length;
    const completionRate =
      totalSessionsInPlans > 0
        ? Math.round((completedCount / totalSessionsInPlans) * 100)
        : 0;

    // RPE stats
    const rpeValues = logs.filter((l) => l.rpe != null).map((l) => l.rpe!);
    const avgRpe = rpeValues.length
      ? Math.round((rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length) * 10) / 10
      : null;

    // Mood breakdown
    const moodCounts: Record<string, number> = {};
    logs.forEach((l) => {
      if (l.mood) {
        moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1;
      }
    });
    const mostCommonMood = Object.entries(moodCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] ?? null;

    // Streak calculation
    let streak = 0;
    if (logs.length > 0) {
      // Simple streak: consecutive days with completions going backwards from today
      const logDates = new Set(
        logs.map((l) => l.completedAt.toISOString().split("T")[0])
      );
      const check = new Date(now);
      for (let i = 0; i < 365; i++) {
        const key = check.toISOString().split("T")[0];
        if (logDates.has(key)) {
          streak++;
          check.setDate(check.getDate() - 1);
        } else if (i === 0) {
          // Today might not have a session — check yesterday
          check.setDate(check.getDate() - 1);
          continue;
        } else {
          break;
        }
      }
    }

    // Weekly RPE trend (last 4 weeks grouped by week)
    const weeklyRpe: { week: string; avgRpe: number; count: number }[] = [];
    for (let w = 3; w >= 0; w--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - w * 7 - weekStart.getDay() + 1);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekLogs = logs.filter(
        (l) => l.completedAt >= weekStart && l.completedAt < weekEnd
      );
      const weekRpeVals = weekLogs
        .filter((l) => l.rpe != null)
        .map((l) => l.rpe!);
      const weekAvg = weekRpeVals.length
        ? Math.round(
            (weekRpeVals.reduce((a, b) => a + b, 0) / weekRpeVals.length) * 10
          ) / 10
        : 0;

      weeklyRpe.push({
        week: weekStart.toISOString().split("T")[0],
        avgRpe: weekAvg,
        count: weekLogs.length,
      });
    }

    return NextResponse.json({
      data: {
        totalSessions: totalSessionsInPlans,
        completedSessions: completedCount,
        completionRate,
        avgRpe,
        mostCommonMood,
        streak,
        weeklyRpe,
        moodCounts,
      },
    });
  } catch (error) {
    console.error("GET /api/progress error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
