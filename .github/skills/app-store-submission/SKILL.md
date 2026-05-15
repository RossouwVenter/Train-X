---
name: app-store-submission
description: 'Guide for submitting the TrainX mobile app to Apple App Store and Google Play Store. Use when: preparing store assets, configuring EAS Submit, building production binaries, creating store listings, handling app review.'
argument-hint: 'Run this skill when ready to submit to app stores'
---

# App Store Submission Skill

## When to Use
- Preparing the app for store submission
- Creating store listing assets (icons, screenshots, descriptions)
- Configuring EAS Build + Submit for production
- Handling app review feedback

## Pre-Submission Checklist

### Code Readiness
- [ ] All P0 E2E tests passing
- [ ] No console.log/warn in production build
- [ ] Error tracking configured (Sentry or similar)
- [ ] Analytics configured (opt-in, privacy compliant)
- [ ] Environment variables set for production API URL
- [ ] App version and build number set correctly
- [ ] Deep links tested
- [ ] Push notification tokens registered (if applicable)

### Assets Required

| Asset | iOS Spec | Android Spec |
|-------|----------|-------------|
| App Icon | 1024×1024 PNG (no alpha, no rounded corners) | 512×512 PNG |
| Splash Screen | 2732×2732 (centered logo) | 1920×1080 |
| Feature Graphic | — | 1024×500 |
| Screenshots | 6.7" (1290×2796), 6.5" (1284×2778), 5.5" (1242×2208) | Phone (1080×1920+), 7" tablet, 10" tablet |
| Preview Video | Optional, 15-30s | Optional |

### Store Listing Content

**App Name:** TrainX

**Subtitle (iOS):** Smart Training for Coaches & Athletes

**Short Description (Android):** Manage training plans, track progress, and connect with your coach.

**Full Description:**
```
TrainX connects coaches and athletes in one powerful platform.

FOR COACHES:
• Create personalized weekly training plans
• Track athlete progress and completion rates
• Provide feedback on individual sessions
• Monitor RPE trends and workout difficulty

FOR ATHLETES:
• View your weekly training schedule
• Log completed sessions with actual performance
• Rate session difficulty and leave comments
• Track your progress over time

Built for serious training partnerships. Clean design, fast performance, no clutter.
```

**Category:** Health & Fitness
**Keywords (iOS):** training, coach, athlete, workout, fitness, plan, tracking, RPE, exercise, sports

## EAS Build Configuration

### Production Build

```bash
# Build for both platforms
eas build --platform all --profile production

# iOS only
eas build --platform ios --profile production

# Android only
eas build --platform android --profile production
```

### Production `eas.json` Config

```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.trainx.app",
        "buildNumber": "1"
      },
      "android": {
        "package": "com.trainx.app",
        "versionCode": 1,
        "buildType": "app-bundle"
      }
    }
  }
}
```

## Apple App Store Submission

### 1. Apple Developer Account Setup
- Enroll at developer.apple.com ($99/year)
- Create App ID with bundle identifier `com.trainx.app`
- Create App Store Connect listing

### 2. Build & Submit
```bash
# Build production IPA
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios

# Or manually: download .ipa from EAS → upload via Transporter app
```

### 3. App Store Connect Configuration
- Fill in all metadata fields
- Upload screenshots for required device sizes
- Set age rating (complete questionnaire)
- Add privacy policy URL
- Configure app review information:
  - Demo account credentials (from TEST_LOGINS.md)
  - Notes: "This app requires a backend server. Demo account is pre-configured."
- Set pricing (Free / Paid / Subscription)
- Select availability (countries)

### 4. App Review Guidelines to Watch
- **4.0 Design** — Must feel native, not a wrapped website
- **4.2 Minimum Functionality** — Must provide enough value
- **5.1.1 Data Collection** — Disclose what you collect
- **5.1.2 Data Use** — Privacy nutrition label must be accurate
- **In-App Purchases** — If you add subscriptions, must use Apple's IAP

## Google Play Store Submission

### 1. Google Play Console Setup
- Register at play.google.com/console ($25 one-time)
- Create new app listing
- Set up Google Play App Signing

### 2. Build & Submit
```bash
# Build production AAB
eas build --platform android --profile production

# Submit to Play Console
eas submit --platform android
```

### 3. Play Console Configuration
- Complete store listing (title, descriptions, screenshots)
- Complete content rating (IARC questionnaire)
- Complete Data Safety section
- Set target audience and content
- Select countries and pricing
- Set up internal/closed/open testing tracks first

### 4. Data Safety Form
Declare honestly:
- Account info (email, name) — collected
- Fitness data (workouts, RPE) — collected
- Data encrypted in transit — yes (HTTPS)
- Data deletion available — yes (/api/auth/delete-account)

## Release Strategy

```
1. Internal Testing (team only)
   → Fix critical bugs

2. Closed Beta (TestFlight / Closed Track)
   → 10-50 external testers
   → Collect feedback for 1-2 weeks

3. Open Beta (optional)
   → Wider audience

4. Production Release
   → Submit for review
   → Apple: 1-3 days review
   → Google: 1-7 days review

5. Post-Launch
   → Monitor crash reports
   → Respond to reviews
   → Plan v1.1 update
```

## Post-Submission Monitoring

- **Crash tracking:** Sentry / Firebase Crashlytics
- **Analytics:** Expo Analytics / Mixpanel
- **Reviews:** Respond within 24 hours
- **Updates:** OTA updates via `expo-updates` for JS changes
- **Native updates:** New EAS build + store submission for native changes
