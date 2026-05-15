# Sprint M2 — Core Screens (Coach + Athlete)

> **Branch:** `feature/mobile-app`  
> **Duration:** ~2 weeks  
> **Goal:** Both coach and athlete roles have functional main screens with real data.

---

## Success Criteria

- [ ] Coach sees dashboard with athlete list (real data from API)
- [ ] Coach can view individual athlete details and their plans
- [ ] Coach can create a new training plan with sessions and exercises
- [ ] Athlete sees weekly training schedule
- [ ] Athlete can view session details with all exercises
- [ ] Athlete can mark a session as complete with RPE + notes
- [ ] Pull-to-refresh works on all list views
- [ ] Skeleton loading states shown during data fetches
- [ ] Empty states display helpful messages
- [ ] All screens work on both iOS and Android

---

## Tasks

### Phase 1: Coach Dashboard (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 1.1 | Athlete list screen | FlatList with athlete cards (name, sport, last activity) | 3h |
| 1.2 | Athlete card component | Avatar, name, status badge, tap → navigate to detail | 1h |
| 1.3 | Pull-to-refresh | Invalidate query on pull, show refresh indicator | 30m |
| 1.4 | Empty state | "No athletes yet" with onboarding hint | 30m |
| 1.5 | Search/filter athletes | Search bar at top, filter by name | 1h |
| 1.6 | Athlete detail screen | `app/athlete/[id].tsx` — profile + plan list + progress summary | 3h |

### Phase 2: Training Plan Management (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 2.1 | Plan list view | Coach sees all plans for an athlete (active, draft, completed) | 2h |
| 2.2 | Plan detail screen | `app/plan/[id].tsx` — sessions listed by day, expand to see exercises | 3h |
| 2.3 | Create plan flow | Bottom sheet or new screen: name, week start, description | 3h |
| 2.4 | Add session to plan | Day picker, title, type (strength/cardio/recovery), notes | 2h |
| 2.5 | Add exercises to session | Exercise name, sets, reps, weight, rest period, reorderable list | 4h |
| 2.6 | Plan status management | Draft → Active → Completed transitions | 1h |
| 2.7 | Assign plan to athlete | Confirm and activate flow | 1h |

### Phase 3: Athlete Weekly View (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 3.1 | Weekly calendar strip | Horizontal day selector (Mon–Sun) with active day highlighted | 3h |
| 3.2 | Session list for day | Cards showing session title, type, exercise count, completion status | 2h |
| 3.3 | Session detail screen | `app/session/[id].tsx` — exercise list with sets/reps/weight targets | 3h |
| 3.4 | Exercise card component | Name, prescribed values, actual values (if completed), notes | 2h |
| 3.5 | Week navigation | Swipe or arrows to go to next/previous week | 2h |
| 3.6 | Plan overview tab | Full plan view (all weeks) for reference | 2h |

### Phase 4: Session Completion (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 4.1 | "Mark Complete" button | Fixed at bottom of session detail, prominent CTA | 1h |
| 4.2 | Completion bottom sheet | RPE slider (1–10), mood selector, notes textarea | 3h |
| 4.3 | RPE slider component | Custom slider with color gradient (green → red), haptic on change | 2h |
| 4.4 | Mood selector | 5 mood options (emoji + label), single select | 1h |
| 4.5 | Submit completion | POST to `/api/sessions/log`, optimistic update, success animation | 2h |
| 4.6 | Completed state | Session card shows ✓, RPE badge, timestamp | 1h |
| 4.7 | Undo completion | Allow undo within 5 minutes (optional stretch) | 2h |

### Phase 5: API Hooks (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 5.1 | `useAthletes()` | Fetch coach's athletes with caching | 1h |
| 5.2 | `useAthlete(id)` | Single athlete with profile + plans | 1h |
| 5.3 | `useTrainingPlan(id)` | Plan with sessions + exercises (nested) | 1h |
| 5.4 | `useWeekSessions(date)` | Athlete's sessions for a given week | 1h |
| 5.5 | `useCreatePlan()` | Mutation: create plan | 1h |
| 5.6 | `useCreateSession()` | Mutation: add session to plan | 1h |
| 5.7 | `useAddExercise()` | Mutation: add exercise to session | 1h |
| 5.8 | `useLogSession()` | Mutation: mark session complete with RPE/mood | 1h |

### Phase 6: Testing (MobileQA Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 6.1 | Coach dashboard test | Renders athlete list, handles empty/loading/error | 2h |
| 6.2 | Plan creation flow test | Form validation, submit, success state | 2h |
| 6.3 | Athlete weekly view test | Correct sessions for selected day | 2h |
| 6.4 | Session completion test | RPE validation, submit, optimistic update | 2h |
| 6.5 | E2E: Coach creates plan | Maestro flow: login → create plan → add session → assign | 3h |
| 6.6 | E2E: Athlete completes session | Maestro flow: login → view session → complete → verify | 3h |
| 6.7 | Cross-platform verification | Run all screens on both iOS and Android, document differences | 2h |

---

## Component Library (built during this sprint)

| Component | Location | Used By |
|-----------|----------|---------|
| `AthleteCard` | `components/training/` | Coach dashboard |
| `PlanCard` | `components/training/` | Plan list |
| `SessionCard` | `components/session/` | Weekly view, plan detail |
| `ExerciseCard` | `components/session/` | Session detail |
| `WeekStrip` | `components/shared/` | Athlete weekly view |
| `RPESlider` | `components/session/` | Completion sheet |
| `MoodSelector` | `components/session/` | Completion sheet |
| `EmptyState` | `components/ui/` | All lists |
| `SkeletonCard` | `components/ui/` | All loading states |
| `BottomSheet` | `components/ui/` | Actions, forms |
| `Badge` | `components/ui/` | Status, RPE, type |

---

## Dependencies

```
Sprint M1 complete (auth works, API client ready)
        │
        ▼
Phase 5 (hooks) ──► Phase 1 (coach dashboard) ──► Phase 2 (plan management)
        │
        ▼
Phase 3 (athlete view) ──► Phase 4 (completion)
        │
        ▼
Phase 6 (testing)
```

---

## Agent Assignments

| Phase | Primary Agent | Support |
|-------|--------------|---------|
| 1–4 | Mobile | — |
| 5 | Mobile | Backend (if new endpoints needed) |
| 6 | MobileQA | Mobile (bug fixes) |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Nested data (plan→sessions→exercises) causes waterfall requests | High | Ensure backend returns nested data in single endpoint |
| Plan builder UX too complex for mobile | Medium | Use step-by-step flow instead of single form |
| Performance with large exercise lists | Low | Use FlatList virtualization, limit initial render |
| Calendar strip gesture conflicts with tab swipe | Low | Test early, adjust gesture handlers |
