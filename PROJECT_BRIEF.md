# PROJECT_BRIEF.md — TrainX 2.0

> Last updated: 2026-05-05 | Sprint 0 | Status: Planning Complete

## 1. Project Overview

TrainX 2.0 is a web application for coaches and athletes to manage training plans, track progress, and exchange feedback. Coaches create personalized weekly training plans for their athletes, monitor completion, and provide feedback. Athletes view their schedules, mark sessions complete, rate difficulty, and communicate back to their coach.

## 2. Concept / Product Description

### User Roles

**Coach:**
- Logs in and sees a dashboard of all their athletes
- Creates/edits weekly training plans per athlete (sessions with exercises, sets, reps, notes)
- Views athlete progress: completion rates, session feedback, trends
- Provides feedback on individual sessions or overall performance
- Gets notified when athletes complete sessions or leave comments

**Athlete:**
- Logs in and sees their weekly training schedule
- Views each session with exercises, prescribed sets/reps/weight
- Marks sessions as complete
- Rates session difficulty (RPE) and leaves comments
- Sees coach feedback on their performance
- Views their own progress history

### Core User Flows

```
Coach Flow:
Login → Dashboard (athlete list) → Select Athlete → View/Create Plan → Review Feedback

Athlete Flow:
Login → Weekly View → Session Detail → Complete & Comment → View Coach Feedback
```

## 3. Tech Stack

- **Frontend (Web):** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Frontend (Mobile):** Expo SDK 52+, React Native, TypeScript, NativeWind, Expo Router
- **Backend:** Next.js API Routes (full-stack), Prisma ORM
- **Database:** PostgreSQL (Supabase or Neon for hosted)
- **Auth:** NextAuth.js v5 (web), JWT Bearer tokens (mobile)
- **Hosting:** Vercel (frontend + API), Supabase (database)
- **Mobile Distribution:** EAS Build + Submit (App Store + Play Store)
- **Testing:** Vitest (unit), Playwright (E2E web), Jest + RNTL (mobile unit), Maestro (mobile E2E)
- **CI/CD:** GitHub Actions

## 4. Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js Frontend (App Router)       │
│  Dashboard │ Training Plans │ Session View      │
│  Feedback  │ Progress Charts │ Auth Pages       │
└──────────────────────┬──────────────────────────┘
                       │ Server Actions / API Routes
┌──────────────────────▼──────────────────────────┐
│              Next.js Backend                     │
│  /api/auth  │ /api/athletes │ /api/plans        │
│  /api/sessions │ /api/feedback │ /api/progress  │
└──────────────────────┬──────────────────────────┘
                       │ Prisma ORM
┌──────────────────────▼──────────────────────────┐
│              PostgreSQL (Supabase)               │
│  users │ athletes │ training_plans │ sessions   │
│  exercises │ session_logs │ feedback │ comments  │
└─────────────────────────────────────────────────┘
```

### Data Model (Core Tables)

| Table | Purpose |
|-------|---------|
| `users` | Auth accounts (coach or athlete role) |
| `coach_profiles` | Coach-specific info |
| `athlete_profiles` | Athlete-specific info, linked to coach |
| `training_plans` | Weekly plans assigned to athletes |
| `plan_sessions` | Individual sessions within a plan (day, type) |
| `session_exercises` | Exercises within a session (sets, reps, weight) |
| `session_logs` | Athlete completion records (completed_at, RPE, notes) |
| `feedback` | Coach↔Athlete messages on sessions/plans |

## 5. Key Files Map

| Area | Path | Contents |
|------|------|----------|
| App entry | `src/app/` | Next.js app router pages |
| Components | `src/components/` | Reusable UI components |
| API | `src/app/api/` | API route handlers |
| Database | `prisma/schema.prisma` | Database schema |
| Auth | `src/lib/auth.ts` | NextAuth configuration |
| Agents | `.github/agents/` | AI agent definitions |
| Skills | `.github/skills/` | Agent skills |
| Instructions | `.github/copilot-instructions.md` | Project-wide guidelines |
| Sprint docs | `docs/sprint-N/` | Plans, progress, done |
| Decisions | `docs/decisions.md` | Architecture decision log |

## 6. Team Roles

| Agent | Role | Status |
|-------|------|--------|
| Manager | Sprint planning, coordination, agent creation | ✅ Active |
| Frontend | UI components, pages, client logic | ✅ Active |
| Backend | APIs, database, auth, server logic | ✅ Active |
| Mobile | React Native / Expo screens, mobile navigation, mobile API integration | ✅ Active |
| MobileQA | Mobile E2E testing, platform verification, accessibility testing | ✅ Active |
| QA | Testing, bug filing, sign-off | 🔲 On demand |
| Designer | CSS, design system, accessibility | 🔲 On demand |
| DevOps | CI/CD, deployment, infrastructure | 🔲 On demand |

## 7. Sprint Status

| Sprint | Name | Status | Scope |
|--------|------|--------|-------|
| 0 | Bootstrap | ✅ Done | Project structure, agent setup, tech stack decisions |
| 1 | Foundation | 📋 Planned | Auth, database schema, project scaffold, basic layouts |
| 2 | Coach Core | 📋 Planned | Coach dashboard, athlete management, plan creation |
| 3 | Athlete Core | 📋 Planned | Athlete weekly view, session completion, feedback |
| 4 | Feedback Loop | 📋 Planned | Coach feedback, progress tracking, notifications |
| 5 | Polish & Deploy | 📋 Planned | UI polish, E2E tests, deployment, QA sign-off |
| M1 | Mobile Foundation | 📋 Planned | Expo scaffold, auth, API client, shared types |
| M2 | Mobile Core Screens | 📋 Planned | Coach dashboard, athlete views, session completion |
| M3 | Mobile Feedback & Polish | 📋 Planned | Feedback loop, progress charts, animations, offline |
| M4 | Store Submission | 📋 Planned | Production builds, beta testing, App Store + Play Store |

## 8. Current State

**What works:**
- Manager agent created and ready
- Agent creation skill with templates available
- Project structure scaffolded
- Product defined and tech stack selected
- Sprint roadmap planned

**What doesn't work yet:**
- No application code yet
- Database not provisioned
- No authentication implemented

**What's next:**
- Sprint 1: Scaffold Next.js app, set up Prisma + PostgreSQL, implement auth, build basic page layouts

## 9. Design Direction

**Modern & Sleek** — The app should feel premium and minimal:
- Dark-mode first, clean lines, generous whitespace
- Card-based layouts with subtle shadows and backdrop blur
- Smooth micro-interactions (150-300ms transitions)
- Skeleton loading states, not spinners
- Inter/Geist font family, clear typographic hierarchy
- Minimal accent palette with muted backgrounds
- Mobile-first responsive design

## 10. Security Rules

1. Secrets live in environment variables only — never in code or git
2. All user input must be validated at system boundaries
3. Follow OWASP Top 10 guidelines
4. Role-based access control: coaches only see their own athletes
5. Athletes only see their own data
6. Passwords hashed with bcrypt (min 12 rounds)
7. Session tokens are httpOnly, secure, sameSite
8. All database queries use parameterized inputs via Prisma

## 11. How to Run Locally

```bash
npm install
cp .env.example .env.local    # Fill in database URL and auth secrets
npx prisma generate
npx prisma db push
npm run dev                    # http://localhost:3000
```

## 12. How to Deploy

```bash
# Vercel deployment (auto-deploys from main branch)
vercel --prod

# Database migrations
npx prisma migrate deploy
```

## 13. Cross-Chat Handoff Protocol

When context gets long (>100 messages) or switching between agent chats:

1. Update `docs/sprint-N/progress.md` with current status
2. Update sections 7 and 8 of this document
3. New chat starts by reading this file + latest sprint progress

## 14. Bug & Fix Tracking

- Bugs are filed as GitHub Issues with labels (`bug`, `sprint-N`, severity)
- Fixes reference issues in commit messages: `fix: description (Fixes #NN)`
- QA verifies fixes before closing issues

## 15. Agent Creation Protocol

When the Manager creates a new agent:
1. Create `.github/agents/<role>.agent.md` using templates from `.github/skills/create-agent/references/agent-templates.md`
2. Update section 6 of this document to reflect the new team member
3. Brief the new agent on current sprint context
