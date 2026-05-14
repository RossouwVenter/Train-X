import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { secret } = await request.json();

  if (secret !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.feedback.deleteMany();
    await prisma.sessionLog.deleteMany();
    await prisma.sessionExercise.deleteMany();
    await prisma.planSession.deleteMany();
    await prisma.trainingPlan.deleteMany();
    await prisma.athleteProfile.deleteMany();
    await prisma.coachProfile.deleteMany();
    await prisma.user.deleteMany();

    return NextResponse.json({ message: "All users deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 }
    );
  }
}
