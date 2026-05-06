# Sprint 1 Plan — Foundation

> Start: TBD | Target: 1 week | Branch: `feature/sprint-1`

## Goal

Scaffold the application with working authentication, database schema, and basic page layouts. By the end, both coach and athlete can register, log in, and land on their respective dashboards.

## Tasks

### 1. Project Scaffold
**Agent:** Frontend  
**Priority:** P0  
**Description:** Initialize Next.js 14 with App Router, TypeScript, Tailwind CSS, and shadcn/ui. Configure project structure.

**Acceptance Criteria:**
- `npm run dev` starts without errors
- Tailwind + shadcn/ui components render correctly
- TypeScript strict mode enabled
- Folder structure matches Key Files Map in PROJECT_BRIEF.md

### 2. Database Schema
**Agent:** Backend  
**Priority:** P0  
**Description:** Set up Prisma with PostgreSQL. Define core data model.

**Tables to create:**
- `User` — id, email, passwordHash, role (COACH/ATHLETE), createdAt
- `CoachProfile` — id, userId, name, bio, avatarUrl
- `AthleteProfile` — id, userId, coachId, name, sport, avatarUrl
- `TrainingPlan` — id, athleteId, coachId, name, weekStartDate, status
- `PlanSession` — id, planId, dayOfWeek, title, type, order
- `SessionExercise` — id, sessionId, name, sets, reps, weight, notes, order
- `SessionLog` — id, sessionId, athleteId, completedAt, rpe, notes
- `Feedback` — id, sessionLogId, authorId, content, createdAt

**Acceptance Criteria:**
- `npx prisma db push` succeeds
- `npx prisma studio` shows all tables
- Relations are correctly defined with cascading deletes

### 3. Authentication
**Agent:** Backend  
**Priority:** P0  
**Description:** Implement NextAuth.js v5 with credentials provider. Support coach and athlete roles.

**Acceptance Criteria:**
- Register endpoint creates user with hashed password
- Login returns session with role info
- Protected routes redirect to login if unauthenticated
- Role stored in JWT/session for client-side checks
- Middleware protects `/coach/*` routes (coach only) and `/athlete/*` routes (athlete only)

### 4. App Layout & Navigation
**Agent:** Frontend  
**Priority:** P1  
**Description:** Build the shared layout shell with role-based navigation.

**Coach nav:** Dashboard, Athletes, Plans, Profile  
**Athlete nav:** My Week, Progress, Profile

**Acceptance Criteria:**
- Responsive sidebar (collapsible on mobile)
- Active route highlighted
- User avatar + logout in header
- Different nav items based on role

### 5. Auth Pages
**Agent:** Frontend  
**Priority:** P1  
**Description:** Login and registration pages with form validation.

**Acceptance Criteria:**
- Login page with email/password
- Register page with name, email, password, role selector
- Client-side validation (required fields, email format, password min length)
- Error messages for invalid credentials
- Redirect to dashboard on success

### 6. Seed Data
**Agent:** Backend  
**Priority:** P2  
**Description:** Create a seed script with test data for development.

**Seed data:**
- 1 coach (coach@trainx.dev / password123)
- 3 athletes linked to that coach
- 1 sample training plan with 3 sessions
- Each session has 3-4 exercises

**Acceptance Criteria:**
- `npx prisma db seed` populates database
- Coach can log in and see athletes
- Athlete can log in and see a plan

## Dependencies

```
Task 1 (Scaffold) → Task 4 (Layout) → Task 5 (Auth Pages)
Task 1 (Scaffold) → Task 2 (Schema) → Task 3 (Auth) → Task 6 (Seed)
```

## Definition of Done

- [ ] Coach can register, log in, see empty dashboard
- [ ] Athlete can register, log in, see empty weekly view
- [ ] Unauthorized access redirects to login
- [ ] Coach cannot access athlete routes and vice versa
- [ ] Database has seed data for development
- [ ] Code passes TypeScript strict checks
- [ ] All pages are responsive (mobile + desktop)
