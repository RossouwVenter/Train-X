# Sprint M1 — Progress Tracker

> **Started:** 2026-05-15  
> **Status:** 🚧 In Progress

## Completed

- [x] Phase 1.1: Initialize Expo project (package.json, app.json, configs)
- [x] Phase 1.2: Dependencies configured in package.json
- [x] Phase 1.3: Expo Router configured (file-based routing, auth + tabs groups)
- [x] Phase 1.4: NativeWind configured (tailwind.config.js, babel, metro, global.css)
- [x] Phase 1.5: Project structure created (components, hooks, lib, constants, assets)
- [x] Phase 1.6: TypeScript paths configured (@/, @shared/)
- [x] Phase 1.7: .gitignore for mobile added
- [x] Phase 2.1: Created shared/ directory with package.json + tsconfig
- [x] Phase 2.2: Extracted Zod schemas to shared/validations.ts
- [x] Phase 2.3: Extracted shared types to shared/types.ts
- [x] Phase 3.1: SecureStore wrapper (lib/storage.ts)
- [x] Phase 3.2: Typed API client (lib/api-client.ts) with auth headers + error handling
- [x] Phase 3.3: Auth hook/context (hooks/useAuth.ts) with login, logout, register
- [x] Phase 3.4: Root layout with QueryClient + AuthProvider
- [x] Phase 3.5: Auth guard navigation (redirects based on auth state)
- [x] Phase 4.1: Auth layout (dark background, stack navigator)
- [x] Phase 4.2: Login screen (email/password, Zod validation, error states)
- [x] Phase 4.3: Register screen (name/email/password/role selector, coach code)
- [x] Phase 5.1: Tab layout (4 tabs with icons: Home, Plans, Progress, Profile)
- [x] Phase 5.2: Home tab (placeholder with role-based content)
- [x] Phase 5.3: Profile tab (user info, logout, delete account)
- [x] Phase 7.1: Mobile login endpoint (POST /api/auth/mobile/login) — JWT via jose
- [x] Phase 7.2: Mobile session endpoint (GET /api/auth/mobile/session) — validates Bearer token
- [x] Phase 6.1: Jest configuration (jest.config.js, jest.setup.ts)
- [x] Phase 6.2: API client unit tests (token injection, error handling, 401 redirect)
- [x] Phase 6.3: Storage unit tests (SecureStore wrapper)
- [x] Phase 6.5: GitHub Actions workflow (mobile-tests.yml)
- [x] EAS Build configuration (eas.json)

## In Progress

- [ ] Phase 2.4: npm install (dependencies resolving)
- [ ] Phase 2.5: Verify web app still works with jose dependency added

## Remaining

- [ ] Phase 4.4: Forgot password screen
- [ ] Phase 5.4: Theme setup (dark/light toggle)
- [ ] Phase 6.4: Login screen component test
- [ ] Phase 7.3: CORS configuration (if needed)
- [ ] Phase 7.4: API contract documentation
- [ ] Verify Expo starts without errors
- [ ] Test on iOS simulator

## Blockers

- None currently (npm install in progress)
