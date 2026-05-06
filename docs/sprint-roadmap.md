# Sprint Roadmap — TrainX 2.0

## Overview

5 sprints to deliver a coach/athlete training management platform.

```
Sprint 1 ──► Sprint 2 ──► Sprint 3 ──► Sprint 4 ──► Sprint 5
Foundation   Coach Core   Athlete Core  Feedback     Polish &
                                        Loop         Deploy
```

---

## Sprint 1 — Foundation

**Goal:** Working app shell with auth, database, and basic navigation.

| # | Task | Agent |
|---|------|-------|
| 1 | Scaffold Next.js 14 + TypeScript + Tailwind + shadcn/ui | Frontend |
| 2 | Set up Prisma schema (users, profiles, plans, sessions) | Backend |
| 3 | Implement NextAuth with role-based login (coach/athlete) | Backend |
| 4 | Create layout: sidebar nav, responsive shell | Frontend |
| 5 | Build login/register pages | Frontend |
| 6 | Seed database with test coach + 3 athletes | Backend |

**Success Criteria:**
- Coach and athlete can register and log in
- Role-based redirect after login (coach → dashboard, athlete → weekly view)
- Database schema deployed with seed data

---

## Sprint 2 — Coach Core

**Goal:** Coach can manage athletes and create training plans.

| # | Task | Agent |
|---|------|-------|
| 1 | Coach dashboard: athlete list with status cards | Frontend |
| 2 | API: CRUD athletes (invite, view, archive) | Backend |
| 3 | Training plan builder: weekly template with sessions | Frontend |
| 4 | API: CRUD training plans and sessions | Backend |
| 5 | Exercise library: add exercises to sessions (sets/reps/weight) | Frontend + Backend |
| 6 | Assign plan to athlete with start date | Backend |

**Success Criteria:**
- Coach sees all athletes on dashboard
- Coach can create a weekly plan with multiple sessions
- Each session has exercises with prescribed sets/reps/weight
- Plan is assigned and visible to the athlete

---

## Sprint 3 — Athlete Core

**Goal:** Athlete can view training, complete sessions, and leave feedback.

| # | Task | Agent |
|---|------|-------|
| 1 | Athlete weekly view: calendar/list of sessions | Frontend |
| 2 | Session detail page: exercise list with targets | Frontend |
| 3 | Mark session complete with actual values logged | Frontend + Backend |
| 4 | RPE rating (1-10) and session comments | Frontend + Backend |
| 5 | API: session completion logs | Backend |
| 6 | Athlete progress view: completion history | Frontend |

**Success Criteria:**
- Athlete sees their weekly training plan
- Can open a session and see all exercises
- Can mark complete, log actual weights/reps, rate RPE, leave comments
- Completion data persisted and visible to coach

---

## Sprint 4 — Feedback Loop

**Goal:** Two-way communication between coach and athlete.

| # | Task | Agent |
|---|------|-------|
| 1 | Coach feedback on individual sessions | Frontend + Backend |
| 2 | Coach can view athlete's session logs and comments | Frontend |
| 3 | Progress dashboard: completion rates, RPE trends, charts | Frontend |
| 4 | Notification system (in-app) for new feedback/completions | Backend |
| 5 | Athlete sees coach feedback on their sessions | Frontend |
| 6 | Weekly summary view for coach (all athletes at a glance) | Frontend |

**Success Criteria:**
- Coach can write feedback on any completed session
- Athlete sees coach feedback inline on their sessions
- Progress charts show trends over time
- In-app notifications for key events

---

## Sprint 5 — Polish & Deploy

**Goal:** Production-ready with tests, polish, and deployment.

| # | Task | Agent |
|---|------|-------|
| 1 | E2E tests: auth flow, plan creation, session completion | QA |
| 2 | Responsive design audit and fixes | Designer |
| 3 | Loading states, error boundaries, empty states | Frontend |
| 4 | API input validation and error handling audit | Backend |
| 5 | CI/CD pipeline: lint, test, deploy on merge to main | DevOps |
| 6 | Production deployment to Vercel + Supabase | DevOps |
| 7 | Security audit: OWASP checklist | Security |

**Success Criteria:**
- All E2E tests pass
- App works on mobile and desktop
- Deployed to production URL
- No critical/high security findings
