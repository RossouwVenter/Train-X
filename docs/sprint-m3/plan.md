# Sprint M3 — Feedback, Progress & Polish

> **Branch:** `feature/mobile-app`  
> **Duration:** ~2 weeks  
> **Goal:** Full feedback loop between coach and athlete, progress tracking, and UI polish.

---

## Success Criteria

- [ ] Coach can write feedback on completed sessions
- [ ] Athlete sees coach feedback inline on their sessions
- [ ] Progress screen shows completion rates and RPE trends (charts)
- [ ] Push notifications for key events (session complete, new feedback)
- [ ] Smooth animations on all transitions and interactions
- [ ] Haptic feedback on key actions
- [ ] Offline-aware: graceful handling of no connectivity
- [ ] Both roles have complete, polished flows end-to-end
- [ ] All P0 + P1 E2E tests passing on both platforms

---

## Tasks

### Phase 1: Feedback System (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 1.1 | Coach feedback on session | Bottom sheet on session log: text input + submit | 2h |
| 1.2 | Feedback API hooks | `useSendFeedback()`, `useFeedback(sessionLogId)` | 1h |
| 1.3 | Feedback display (athlete) | Show coach feedback card below completed session | 2h |
| 1.4 | Feedback display (coach) | Show athlete's notes + own feedback on session log view | 2h |
| 1.5 | Feedback notification badge | Tab icon badge when new unread feedback exists | 1h |
| 1.6 | Feedback timestamp + read status | Show "2 hours ago", mark as read on view | 1h |

### Phase 2: Progress & Analytics (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 2.1 | Progress screen layout | `app/(tabs)/progress.tsx` — scrollable dashboard with cards | 2h |
| 2.2 | Completion rate card | Circular progress indicator: sessions completed / total this week | 3h |
| 2.3 | RPE trend chart | Line chart showing RPE over last 4 weeks (react-native-chart-kit or Victory) | 4h |
| 2.4 | Weekly summary card | Total sessions, avg RPE, most common mood, streak count | 2h |
| 2.5 | Coach: athlete progress view | Same charts but for a specific athlete (from athlete detail screen) | 2h |
| 2.6 | Date range selector | Toggle: This week / Last 4 weeks / All time | 1h |

### Phase 3: Push Notifications (Mobile Agent + Backend Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 3.1 | Configure expo-notifications | Request permissions, get push token | 2h |
| 3.2 | Register push token with backend | `POST /api/push/register` — store device token per user | 2h |
| 3.3 | Backend: send notification on events | Session completed → notify coach; Feedback posted → notify athlete | 3h |
| 3.4 | Handle notification tap | Deep link to relevant screen (session detail, feedback) | 2h |
| 3.5 | Notification preferences | Settings screen: toggle which notifications to receive | 1h |
| 3.6 | Badge count management | Update app badge on new notifications, clear on read | 1h |

### Phase 4: Animations & Polish (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 4.1 | Screen transitions | Shared element transitions between list → detail screens | 3h |
| 4.2 | List animations | Items animate in with stagger on first load (Moti) | 2h |
| 4.3 | Completion celebration | Confetti / checkmark animation on session complete | 2h |
| 4.4 | Pull-to-refresh animation | Custom refresh indicator matching brand | 1h |
| 4.5 | Haptic feedback | Tap feedback on buttons, slider changes, completion | 1h |
| 4.6 | Loading skeletons | Skeleton components for all cards and lists | 2h |
| 4.7 | Error state animations | Gentle shake on form errors, retry button pulse | 1h |
| 4.8 | Bottom sheet physics | Spring-based drag with snap points | 2h |

### Phase 5: Offline & Error Handling (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 5.1 | Network status detection | `@react-native-community/netinfo` — detect connectivity | 1h |
| 5.2 | Offline banner | Persistent banner at top when offline | 1h |
| 5.3 | Optimistic mutations | Session completion works offline, syncs when back online | 3h |
| 5.4 | Query retry configuration | TanStack Query retry with exponential backoff | 1h |
| 5.5 | Cache persistence | Persist query cache to AsyncStorage for instant load | 2h |
| 5.6 | Error boundaries | Catch crashes gracefully, show recovery UI | 2h |

### Phase 6: Profile & Settings (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 6.1 | Profile screen enhancement | Edit name, avatar, sport/specialty, bio | 3h |
| 6.2 | Settings screen | Notification preferences, theme toggle, about, version | 2h |
| 6.3 | Account deletion | Confirm dialog → call delete API → logout | 1h |
| 6.4 | Change password | Current + new password form | 2h |
| 6.5 | Coach code display | Coach can view/share their invite code | 1h |

### Phase 7: Testing (MobileQA Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 7.1 | Feedback flow test | Coach sends feedback → athlete receives and views | 2h |
| 7.2 | Progress charts test | Correct data renders in charts, handles empty state | 2h |
| 7.3 | Push notification test | Token registration, notification display, deep link | 2h |
| 7.4 | Offline behavior test | Queue mutations, sync on reconnect, show banner | 2h |
| 7.5 | E2E: Full coach flow | Login → view athlete → give feedback → check progress | 3h |
| 7.6 | E2E: Full athlete flow | Login → view plan → complete session → view feedback → progress | 3h |
| 7.7 | Accessibility audit | Screen reader, touch targets, contrast, font scaling | 3h |
| 7.8 | Performance profiling | Launch time, scroll FPS, memory usage | 2h |

---

## New Backend Endpoints Needed

| Method | Endpoint | Purpose | Agent |
|--------|----------|---------|-------|
| POST | `/api/push/register` | Store device push token | Backend |
| DELETE | `/api/push/register` | Remove push token on logout | Backend |
| POST | `/api/push/send` | Internal: trigger notification | Backend |
| GET | `/api/progress/:athleteId` | Aggregated progress data (completion %, RPE avg, streaks) | Backend |

---

## Dependencies

```
Sprint M2 complete (core screens working)
        │
        ├──► Phase 1 (feedback)
        ├──► Phase 2 (progress)
        ├──► Phase 3 (notifications) ← requires backend work
        │
        ▼
Phase 4 (polish) ──► Phase 5 (offline) ──► Phase 6 (profile)
        │
        ▼
Phase 7 (testing — runs in parallel with Phase 4-6)
```

---

## Agent Assignments

| Phase | Primary Agent | Support |
|-------|--------------|---------|
| 1–2 | Mobile | — |
| 3 | Mobile + Backend | — |
| 4–6 | Mobile | — |
| 7 | MobileQA | Mobile (fixes) |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Push notification setup complex (APNs + FCM) | High | Use Expo Push API (abstracts both platforms) |
| Chart library performance on large datasets | Medium | Limit data points, use virtualized charts |
| Offline sync conflicts | Medium | Last-write-wins for simple data; queue for logs |
| Animation jank on low-end Android | Medium | Test on budget device, reduce animation complexity |
