# Sprint M4 — Store Submission & Launch

> **Branch:** `feature/mobile-app`  
> **Duration:** ~2 weeks  
> **Goal:** Production-ready app submitted to Apple App Store and Google Play Store.

---

## Success Criteria

- [ ] All P0 and P1 E2E tests pass on both platforms
- [ ] No critical or high-severity bugs open
- [ ] App icon, splash screen, and store assets finalized
- [ ] Privacy policy published and accessible via URL
- [ ] TestFlight build distributed to beta testers (1 week of testing)
- [ ] Google Play internal testing track active
- [ ] Production builds submitted to both stores
- [ ] App approved and live (or in review)
- [ ] Crash reporting and analytics configured
- [ ] OTA update mechanism verified

---

## Tasks

### Phase 1: Production Hardening (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 1.1 | Remove all console.log/warn | Strip debug logging from production builds | 1h |
| 1.2 | Error tracking setup | Integrate Sentry (expo-sentry) for crash reporting | 2h |
| 1.3 | Analytics setup | Basic event tracking: screen views, session completions, plan creates | 2h |
| 1.4 | Environment config | Verify prod API URL, ensure no dev endpoints leak | 1h |
| 1.5 | App versioning | Set version 1.0.0, build number 1, configure auto-increment | 30m |
| 1.6 | Performance optimization | Bundle size analysis, lazy load non-critical screens, image optimization | 3h |
| 1.7 | Security audit | Verify SecureStore usage, no hardcoded secrets, HTTPS only | 2h |
| 1.8 | OTA updates config | Configure `expo-updates` for over-the-air JS updates | 2h |

### Phase 2: App Assets & Branding (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 2.1 | App icon design | 1024×1024 icon (both platform variants) | 2h |
| 2.2 | Adaptive icon (Android) | Foreground + background layers | 1h |
| 2.3 | Splash screen | Branded splash with logo, matches theme | 2h |
| 2.4 | Store screenshots | Capture 6+ screenshots per device size, add device frames | 4h |
| 2.5 | Feature graphic (Android) | 1024×500 promotional graphic | 1h |
| 2.6 | App preview video (optional) | 15-30s demo video for App Store | 4h |

### Phase 3: Store Listing Preparation (Manager)

| # | Task | Details | Est |
|---|------|---------|-----|
| 3.1 | Write store description | Title, subtitle, full description, keywords | 2h |
| 3.2 | Privacy policy page | Create and host at trainx.app/privacy (or GitHub Pages) | 2h |
| 3.3 | Terms of service | Create and host at trainx.app/terms | 1h |
| 3.4 | Support URL | trainx.app/support or email contact | 30m |
| 3.5 | Age rating questionnaire | Complete IARC (both stores) | 30m |
| 3.6 | Data safety form (Google) | Declare data collection and usage | 1h |
| 3.7 | App privacy details (Apple) | Privacy nutrition label | 1h |
| 3.8 | Demo account for reviewers | Dedicated test account with sample data pre-loaded | 1h |

### Phase 4: EAS Build & Submit (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 4.1 | Configure EAS credentials | Apple certificates + provisioning; Google Play signing key | 2h |
| 4.2 | Development build | `eas build --profile development` — verify on real device | 1h |
| 4.3 | Preview build | `eas build --profile preview` — internal distribution | 1h |
| 4.4 | Production build (iOS) | `eas build --platform ios --profile production` | 30m |
| 4.5 | Production build (Android) | `eas build --platform android --profile production` | 30m |
| 4.6 | Submit to TestFlight | `eas submit --platform ios` → App Store Connect | 30m |
| 4.7 | Submit to Play internal track | `eas submit --platform android` → Play Console | 30m |
| 4.8 | Beta testing period | 5-7 days of beta testing, collect and fix feedback | ongoing |

### Phase 5: Beta Testing & Bug Fixes (MobileQA + Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 5.1 | Distribute TestFlight build | Invite 10-20 beta testers | 1h |
| 5.2 | Google Play internal testers | Add tester emails to internal track | 1h |
| 5.3 | Collect beta feedback | Track bugs and feature requests from testers | ongoing |
| 5.4 | Fix critical bugs | Address any crashes or blockers found in beta | varies |
| 5.5 | Performance testing on real devices | Test on older devices (iPhone 11, Pixel 4a) | 2h |
| 5.6 | Final E2E test run | All Maestro flows pass on production build | 2h |
| 5.7 | Accessibility final check | VoiceOver (iOS) + TalkBack (Android) full walkthrough | 2h |

### Phase 6: Store Submission (Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 6.1 | Final production build | Increment build number, rebuild with all fixes | 1h |
| 6.2 | Upload to App Store Connect | Upload IPA, fill all metadata fields | 1h |
| 6.3 | Upload to Google Play Console | Upload AAB, fill all metadata fields | 1h |
| 6.4 | Submit for Apple review | Submit + provide review notes and demo account | 30m |
| 6.5 | Submit for Google review | Release to production track | 30m |
| 6.6 | Monitor review status | Check daily; respond to any rejection feedback | ongoing |
| 6.7 | Handle rejection (if any) | Fix issues, rebuild, resubmit | varies |

### Phase 7: Post-Launch (Manager + Mobile Agent)

| # | Task | Details | Est |
|---|------|---------|-----|
| 7.1 | Monitor crash reports | Sentry dashboard, fix any production crashes | ongoing |
| 7.2 | Monitor store reviews | Respond to user reviews within 24h | ongoing |
| 7.3 | First OTA update | Push a minor fix/improvement via expo-updates | 1h |
| 7.4 | Analytics review | Check user flow completion rates, drop-off points | 2h |
| 7.5 | Plan v1.1 update | Based on beta/launch feedback, plan next iteration | 2h |

---

## Store Submission Timeline

```
Day 1-2:   Production hardening + assets
Day 3-4:   EAS builds + store listing prep
Day 5:     Submit to TestFlight + Internal Track
Day 5-12:  Beta testing period (7 days)
Day 12-13: Fix bugs, final build
Day 14:    Submit to both stores for review
Day 15-17: Apple review (1-3 days typical)
Day 15-21: Google review (1-7 days typical)
Day 17-21: 🎉 LIVE on stores
```

---

## Dependencies

```
Sprint M3 complete (all features working)
        │
        ├──► Phase 1 (hardening) + Phase 2 (assets) [parallel]
        │
        ▼
Phase 3 (store prep) + Phase 4 (builds) [parallel]
        │
        ▼
Phase 5 (beta testing — 7 days)
        │
        ▼
Phase 6 (submission)
        │
        ▼
Phase 7 (post-launch — ongoing)
```

---

## Agent Assignments

| Phase | Primary Agent | Support |
|-------|--------------|---------|
| 1 | Mobile | MobileQA (security audit) |
| 2 | Mobile | — |
| 3 | Manager | — |
| 4 | Mobile | — |
| 5 | MobileQA | Mobile (fixes) |
| 6 | Mobile | Manager (store accounts) |
| 7 | Manager + Mobile | MobileQA (monitoring) |

---

## Prerequisites (Must Have Before This Sprint)

- [ ] Apple Developer account enrolled and active
- [ ] Google Play Console account registered
- [ ] Domain for privacy policy hosting (or GitHub Pages configured)
- [ ] Test data seeded in production database
- [ ] Production API deployed and stable on Vercel
- [ ] All Sprint M3 items complete and tested

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Apple rejection (common first time) | High | Follow HIG closely, provide demo account, test review notes |
| Signing certificate issues | Medium | Use EAS managed credentials (handles automatically) |
| Beta testers find critical bug | Medium | Budget 2 days for bug fixes before final submission |
| Store metadata rejection | Low | Follow character limits, avoid trademarked terms |
| Expo-updates OTA conflict with native changes | Low | Only use OTA for JS changes; native changes require new build |
