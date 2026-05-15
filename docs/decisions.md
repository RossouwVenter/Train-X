# Architecture Decisions

## 2026-05-05 — Full-Stack Next.js (No Separate Backend)

**Context:** Need to choose between a separate API server (Express/Fastify) vs. Next.js API routes for the backend.

**Decision:** Use Next.js App Router with API routes and Server Actions for a single deployable unit.

**Alternatives:**
- Separate Express API + React SPA — more flexibility, more infrastructure complexity
- tRPC + Next.js — type-safe but adds learning curve

**Consequences:**
- Single deployment on Vercel (simpler ops)
- Prisma runs in serverless functions (connection pooling needed for scale)
- If we need WebSockets later, we'd add a separate service

---

## 2026-05-05 — PostgreSQL via Supabase

**Context:** Need a relational database for structured coach/athlete/plan data.

**Decision:** PostgreSQL hosted on Supabase (free tier for dev, scalable for production).

**Alternatives:**
- MongoDB — flexible but relational data model fits better here
- PlanetScale (MySQL) — good but PostgreSQL has better JSON support and Prisma compatibility
- SQLite — too limited for multi-user production

**Consequences:**
- Connection string in env vars
- Supabase provides connection pooling via PgBouncer
- Can use Supabase Auth later if needed, but starting with NextAuth for flexibility

---

## 2026-05-05 — NextAuth.js v5 for Authentication

**Context:** Need role-based auth (coach vs athlete) with secure sessions.

**Decision:** NextAuth.js v5 with credentials provider, JWT strategy, role stored in token.

**Alternatives:**
- Supabase Auth — simpler but less flexible for custom role logic
- Clerk — polished but adds vendor dependency and cost
- Custom auth — too much security surface area to maintain

**Consequences:**
- Session includes user role for client-side route guards
- Middleware enforces role-based access on `/coach/*` and `/athlete/*`
- Can add OAuth providers (Google, etc.) later without changing architecture

---

## 2026-05-05 — Tailwind CSS + shadcn/ui for UI

**Context:** Need a component library that's fast to develop with and customizable.

**Decision:** Tailwind CSS for utility styling + shadcn/ui for pre-built accessible components.

**Alternatives:**
- Material UI — heavy, opinionated, harder to customize
- Chakra UI — good but slower than Tailwind for rapid development
- Plain CSS modules — too slow for a small team

**Consequences:**
- Components are copy-pasted into the project (ownable, not a dependency)
- Consistent design out of the box with dark mode support
- Easy to theme and brand later

---

## 2026-05-15 — React Native / Expo for Mobile App

**Context:** Need to bring TrainX to iOS App Store and Google Play Store. Must decide between Capacitor (WebView wrapper), React Native, or Flutter.

**Decision:** React Native with Expo (managed workflow) + Expo Router for file-based navigation.

**Alternatives:**
- Capacitor — wraps existing web app, but feels less native, limited offline capability, WebView performance concerns
- Flutter — excellent performance, but requires Dart (new language for the team), can't share TypeScript types
- Bare React Native — more control but significantly more build/config complexity
- PWA — not listed on app stores, limited native API access

**Consequences:**
- Separate UI codebase in `mobile/` (cannot reuse React DOM components)
- CAN reuse: Zod schemas, TypeScript types, business logic, API contracts (via `shared/`)
- EAS Build handles signing, builds, and store submission
- Expo Router mirrors the file-based routing pattern from Next.js (team familiarity)
- NativeWind allows using Tailwind syntax (team familiarity)
- OTA updates via expo-updates for JS-only changes (no store re-review needed)
- Need to add a JWT Bearer token auth endpoint for mobile (existing NextAuth is cookie-based)

---

## 2026-05-15 — Monorepo Structure (Web + Mobile + Shared)

**Context:** Where should the mobile code live — same repo, separate repo, or separate branch?

**Decision:** Same repo with `mobile/` directory and `shared/` for common code. Not a separate branch or repo.

**Alternatives:**
- Separate repository — independent but creates type drift, harder to keep in sync
- Separate branch — anti-pattern (branches are for versions, not separate apps)
- Turborepo/Nx monorepo — overkill for 2 apps, adds tooling complexity

**Consequences:**
- Single PR workflow, one CI pipeline
- `shared/` package for Zod schemas and TypeScript types (imported by both)
- Both apps deploy independently (Vercel for web, EAS for mobile)
- `.gitignore` updated for mobile build artifacts
