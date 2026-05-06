import { PrismaClient, Role, PlanStatus, Mood } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.feedback.deleteMany()
  await prisma.sessionLog.deleteMany()
  await prisma.sessionExercise.deleteMany()
  await prisma.planSession.deleteMany()
  await prisma.trainingPlan.deleteMany()
  await prisma.athleteProfile.deleteMany()
  await prisma.coachProfile.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 10)

  // ── Coach ────────────────────────────────────────────
  const coachUser = await prisma.user.create({
    data: {
      email: 'coach@trainx.dev',
      passwordHash,
      role: Role.COACH,
      name: 'Coach Demo',
      coachProfile: {
        create: {
          bio: 'Experienced multi-sport coach with 10+ years of training athletes at all levels.',
          specialty: 'Strength & Conditioning',
        },
      },
    },
    include: { coachProfile: true },
  })

  const coachProfile = coachUser.coachProfile!

  // ── Athletes ─────────────────────────────────────────
  const athleteData = [
    { name: 'Alex Runner', email: 'alex@trainx.dev', sport: 'Running' },
    { name: 'Jordan Lifter', email: 'jordan@trainx.dev', sport: 'Weightlifting' },
    { name: 'Sam Swimmer', email: 'sam@trainx.dev', sport: 'Swimming' },
  ]

  const athletes = await Promise.all(
    athleteData.map((a) =>
      prisma.user.create({
        data: {
          email: a.email,
          passwordHash,
          role: Role.ATHLETE,
          name: a.name,
          athleteProfile: {
            create: {
              coachId: coachProfile.id,
              sport: a.sport,
              dateOfBirth: new Date('1998-06-15'),
            },
          },
        },
        include: { athleteProfile: true },
      })
    )
  )

  // ── Training Plan Exercises per Sport ────────────────
  const exercisesByPlan: Record<string, { title: string; type: string; exercises: { name: string; sets: number; reps: number; weight?: number; duration?: number; restPeriod?: number }[] }[]> = {
    Running: [
      {
        title: 'Monday — Tempo Run + Core',
        type: 'Cardio',
        exercises: [
          { name: 'Tempo Run', sets: 1, reps: 1, duration: 30 },
          { name: 'Plank Hold', sets: 3, reps: 1, duration: 1, restPeriod: 30 },
          { name: 'Russian Twists', sets: 3, reps: 20, restPeriod: 30 },
        ],
      },
      {
        title: 'Wednesday — Interval Training',
        type: 'Cardio',
        exercises: [
          { name: '400m Repeats', sets: 8, reps: 1, restPeriod: 90 },
          { name: 'Hill Sprints', sets: 6, reps: 1, restPeriod: 120 },
          { name: 'Cool-down Jog', sets: 1, reps: 1, duration: 10 },
        ],
      },
      {
        title: 'Friday — Long Run + Stretch',
        type: 'Recovery',
        exercises: [
          { name: 'Long Slow Run', sets: 1, reps: 1, duration: 60 },
          { name: 'Hip Flexor Stretch', sets: 2, reps: 1, duration: 2 },
          { name: 'Hamstring Stretch', sets: 2, reps: 1, duration: 2 },
          { name: 'Foam Rolling', sets: 1, reps: 1, duration: 10 },
        ],
      },
    ],
    Weightlifting: [
      {
        title: 'Monday — Upper Body Strength',
        type: 'Strength',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 6, weight: 80, restPeriod: 120 },
          { name: 'Overhead Press', sets: 3, reps: 8, weight: 50, restPeriod: 90 },
          { name: 'Barbell Row', sets: 4, reps: 8, weight: 70, restPeriod: 90 },
          { name: 'Pull-ups', sets: 3, reps: 10, restPeriod: 60 },
        ],
      },
      {
        title: 'Wednesday — Lower Body Power',
        type: 'Strength',
        exercises: [
          { name: 'Back Squat', sets: 5, reps: 5, weight: 120, restPeriod: 180 },
          { name: 'Romanian Deadlift', sets: 4, reps: 8, weight: 90, restPeriod: 120 },
          { name: 'Bulgarian Split Squat', sets: 3, reps: 10, weight: 30, restPeriod: 90 },
        ],
      },
      {
        title: 'Friday — Olympic Lifts',
        type: 'Strength',
        exercises: [
          { name: 'Clean & Jerk', sets: 5, reps: 3, weight: 80, restPeriod: 180 },
          { name: 'Snatch', sets: 5, reps: 2, weight: 60, restPeriod: 180 },
          { name: 'Front Squat', sets: 3, reps: 5, weight: 90, restPeriod: 120 },
          { name: 'Hanging Leg Raise', sets: 3, reps: 12, restPeriod: 60 },
        ],
      },
    ],
    Swimming: [
      {
        title: 'Monday — Endurance Swim',
        type: 'Cardio',
        exercises: [
          { name: 'Warm-up Swim', sets: 1, reps: 1, duration: 10 },
          { name: 'Freestyle Laps', sets: 10, reps: 1, duration: 2, restPeriod: 30 },
          { name: 'Kick Drills', sets: 6, reps: 1, duration: 3, restPeriod: 20 },
        ],
      },
      {
        title: 'Wednesday — Speed & Technique',
        type: 'Cardio',
        exercises: [
          { name: '50m Sprint', sets: 8, reps: 1, restPeriod: 60 },
          { name: 'Catch-up Drill', sets: 4, reps: 1, duration: 5, restPeriod: 30 },
          { name: 'Backstroke Technique', sets: 4, reps: 1, duration: 5, restPeriod: 30 },
        ],
      },
      {
        title: 'Friday — Dryland + Recovery Swim',
        type: 'Recovery',
        exercises: [
          { name: 'Resistance Band Pulls', sets: 3, reps: 15, restPeriod: 45 },
          { name: 'Medicine Ball Throws', sets: 3, reps: 12, weight: 5, restPeriod: 45 },
          { name: 'Easy Recovery Swim', sets: 1, reps: 1, duration: 20 },
          { name: 'Shoulder Stretches', sets: 2, reps: 1, duration: 3 },
        ],
      },
    ],
  }

  const dayMap = [0, 2, 4] // Mon, Wed, Fri

  // ── Create Training Plans ───────────────────────────
  for (const athleteUser of athletes) {
    const profile = athleteUser.athleteProfile!
    const sport = profile.sport!
    const planSessions = exercisesByPlan[sport]

    const plan = await prisma.trainingPlan.create({
      data: {
        athleteId: profile.id,
        coachId: coachProfile.id,
        name: `${sport} — Week 1 Plan`,
        description: `Introductory training plan for ${athleteUser.name}`,
        weekStartDate: new Date('2026-05-04'), // Monday
        status: PlanStatus.ACTIVE,
      },
    })

    for (let i = 0; i < planSessions.length; i++) {
      const s = planSessions[i]
      const session = await prisma.planSession.create({
        data: {
          planId: plan.id,
          dayOfWeek: dayMap[i],
          title: s.title,
          type: s.type,
          order: i + 1,
        },
      })

      await prisma.sessionExercise.createMany({
        data: s.exercises.map((ex, j) => ({
          sessionId: session.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight ?? null,
          duration: ex.duration ?? null,
          restPeriod: ex.restPeriod ?? null,
          order: j + 1,
        })),
      })

      // ── Session log + feedback for first athlete's first session ──
      if (athleteUser === athletes[0] && i === 0) {
        const log = await prisma.sessionLog.create({
          data: {
            sessionId: session.id,
            athleteId: profile.id,
            userId: athleteUser.id,
            completedAt: new Date('2026-05-04T08:30:00Z'),
            rpe: 7,
            notes: 'Felt good overall. Tempo was consistent.',
            mood: Mood.GOOD,
          },
        })

        await prisma.feedback.create({
          data: {
            sessionLogId: log.id,
            authorId: coachUser.id,
            content: 'Great first session! Keep the tempo steady and focus on cadence next time.',
          },
        })
      }
    }
  }

  console.log('✅ Seed complete')
  console.log('   Coach: coach@trainx.dev / password123')
  console.log('   Athletes: alex@trainx.dev, jordan@trainx.dev, sam@trainx.dev / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
