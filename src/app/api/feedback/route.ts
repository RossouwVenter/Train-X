import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/mobile-auth";
import { prisma } from "@/lib/prisma";

// GET /api/feedback?sessionLogId=xxx — get all feedback for a session log
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionLogId = searchParams.get("sessionLogId");

    if (!sessionLogId) {
      return NextResponse.json({ error: "sessionLogId is required" }, { status: 400 });
    }

    const feedbacks = await prisma.feedback.findMany({
      where: { sessionLogId },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    const mapped = feedbacks.map((f) => ({
      id: f.id,
      content: f.content,
      userId: f.authorId,
      sessionLogId: f.sessionLogId,
      createdAt: f.createdAt.toISOString(),
      user: f.author ? { id: f.author.id, name: f.author.name, role: f.author.role } : undefined,
    }));

    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error("GET /api/feedback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/feedback — create feedback on a session log
// Body: { sessionLogId, content }
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionLogId, content } = await request.json();

    if (!sessionLogId || !content?.trim()) {
      return NextResponse.json(
        { error: "sessionLogId and content are required" },
        { status: 400 }
      );
    }

    // Verify the session log exists
    const sessionLog = await prisma.sessionLog.findUnique({
      where: { id: sessionLogId },
      include: { session: { include: { plan: true } } },
    });

    if (!sessionLog) {
      return NextResponse.json({ error: "Session log not found" }, { status: 404 });
    }

    // Authorization: coach of the plan or the athlete who logged it
    const isCoach = user.role === "COACH" && sessionLog.session.plan.coachId === user.id;
    const isAthlete = sessionLog.userId === user.id;

    if (!isCoach && !isAthlete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        sessionLogId,
        authorId: user.id,
        content: content.trim(),
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });

    return NextResponse.json({
      data: {
        id: feedback.id,
        content: feedback.content,
        userId: feedback.authorId,
        sessionLogId: feedback.sessionLogId,
        createdAt: feedback.createdAt.toISOString(),
        user: feedback.author
          ? { id: feedback.author.id, name: feedback.author.name, role: feedback.author.role }
          : undefined,
      },
    });
  } catch (error) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
