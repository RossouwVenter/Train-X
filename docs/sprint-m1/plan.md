# Sprint M1 — Mobile Foundation

> **Branch:** `feature/mobile-app`  
> **Duration:** ~2 weeks  
> **Goal:** Working Expo app shell with navigation, auth, and API integration.

---

## Success Criteria

- [ ] Expo project runs on iOS simulator and Android emulator
- [ ] File-based routing with Expo Router works (auth + tabs layout)
- [ ] NativeWind styling renders correctly on both platforms
- [ ] Login/Register screens functional against existing API
- [ ] Auth tokens stored in SecureStore
- [ ] Protected routes redirect unauthenticated users
- [ ] Shared Zod schemas importable in mobile project
- [ ] Unit tests pass for API client and auth logic
- [ ] CI runs mobile unit tests on push

---

## Tasks

### Phase 1: Project Scaffolding (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 1.1 | Initialize Expo project | `npx create-expo-app mobile --template blank-typescript` | 15m |
| 1.2 | Install dependencies | Expo Router, NativeWind, TanStack Query, Zustand, SecureStore, Reanimated, Lucide | 30m |
| 1.3 | Configure Expo Router | File-based routing, typed routes, `(auth)` and `(tabs)` groups | 1h |
| 1.4 | Configure NativeWind | tailwind.config.js, babel plugin, global styles matching web palette | 1h |
| 1.5 | Set up project structure | `components/`, `hooks/`, `lib/`, `constants/`, `assets/` | 30m |
| 1.6 | Configure TypeScript paths | tsconfig aliases: `@/`, `@shared/` | 30m |
| 1.7 | Add `.gitignore` for mobile | Ignore node_modules, .expo, ios/, android/ build artifacts | 10m |

### Phase 2: Shared Package (Mobile + Backend Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 2.1 | Create `shared/` directory | At repo root, with own `package.json` and `tsconfig.json` | 30m |
| 2.2 | Extract Zod schemas | Copy `src/lib/validations.ts` → `shared/validations.ts` | 30m |
| 2.3 | Extract shared types | API response types, user roles, enums → `shared/types.ts` | 1h |
| 2.4 | Configure imports | Both `src/` and `mobile/` can import from `shared/` via path aliases | 1h |
| 2.5 | Verify web app still works | Ensure existing web imports resolve after extraction | 30m |

### Phase 3: API Client & Auth (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 3.1 | Build SecureStore wrapper | `lib/storage.ts` — get/set/remove token helpers | 30m |
| 3.2 | Build API client | `lib/api-client.ts` — typed fetch with auth headers, error handling | 2h |
| 3.3 | Build auth hook/context | `hooks/useAuth.ts` — login, logout, register, session check | 2h |
| 3.4 | Root layout auth provider | `app/_layout.tsx` wraps app in QueryClient + AuthProvider | 1h |
| 3.5 | Auth guard navigation | Redirect to login if no token; redirect to tabs if authenticated | 1h |

### Phase 4: Auth Screens (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 4.1 | Auth layout | `app/(auth)/_layout.tsx` — centered card, dark background, logo | 1h |
| 4.2 | Login screen | Email + password form, Zod validation, error states, loading state | 3h |
| 4.3 | Register screen | Name + email + password + role selector, coach code input (if athlete) | 3h |
| 4.4 | Forgot password screen | Email input → call reset API → success message | 1h |

### Phase 5: Tab Shell (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 5.1 | Tab layout | `app/(tabs)/_layout.tsx` — bottom tab navigator with icons | 2h |
| 5.2 | Home tab (placeholder) | Shows user name and role, skeleton for dashboard | 1h |
| 5.3 | Profile tab | Shows user info, logout button, account deletion | 2h |
| 5.4 | Theme setup | Dark/light mode toggle, system theme detection | 1h |

### Phase 6: Testing & CI (MobileQA Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 6.1 | Jest configuration | `jest.config.js`, mock setup for Expo modules | 1h |
| 6.2 | API client unit tests | Token injection, error handling, 401 redirect | 2h |
| 6.3 | Auth hook tests | Login flow, token persistence, logout cleanup | 2h |
| 6.4 | Login screen component test | Form validation, error display, submit behavior | 2h |
| 6.5 | GitHub Actions workflow | `mobile-tests.yml` — runs jest on push to `feature/mobile-app` | 1h |

### Phase 7: Backend Adaptation (Backend Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 7.1 | Mobile auth endpoint | `POST /api/auth/mobile/login` — returns JWT + user object | 2h |
| 7.2 | Mobile session validation | `GET /api/auth/mobile/session` — validates Bearer token | 1h |
| 7.3 | CORS configuration | Allow mobile app origin in Next.js API routes | 30m |
| 7.4 | Document API contract | API spec for mobile consumption (endpoints, request/response shapes) | 1h |

---

## Dependencies

```
Phase 1 (scaffold) ──► Phase 2 (shared) ──► Phase 3 (API client)
                                                    │
Phase 7 (backend) ─────────────────────────────────►│
                                                    ▼
                                              Phase 4 (auth screens)
                                                    │
                                                    ▼
                                              Phase 5 (tab shell)
                                                    │
                                                    ▼
                                              Phase 6 (testing)
```

---

## Agent Assignments

| Phase | Primary Agent | Support |
|-------|--------------|---------|
| 1 | Mobile | — |
| 2 | Mobile | Backend (verify web) |
| 3 | Mobile | — |
| 4 | Mobile | — |
| 5 | Mobile | — |
| 6 | MobileQA | — |
| 7 | Backend | — |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| NextAuth cookie-based auth incompatible with mobile | High | Add JWT Bearer token endpoint (Phase 7) |
| NativeWind version conflicts with Expo SDK | Medium | Pin versions, test early in Phase 1 |
| Shared package import issues | Medium | Test with both `npx expo start` and `npm run dev` |
| CORS blocking mobile requests | Low | Configure in Phase 7, test in Phase 3 |
