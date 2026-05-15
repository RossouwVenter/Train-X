---
name: expo-project-setup
description: 'Set up a new Expo project with TypeScript, NativeWind, Expo Router, and all required dependencies for the TrainX mobile app. Use when: initializing the mobile/ directory, scaffolding the Expo app, configuring EAS builds.'
argument-hint: 'Run this skill to scaffold the Expo project in mobile/'
---

# Expo Project Setup Skill

## When to Use
- Initial mobile app scaffolding
- Setting up the Expo project structure in `mobile/`
- Configuring build and deployment tools

## Procedure

### 1. Create the Expo Project

```bash
cd /path/to/TrainX-2.0
npx create-expo-app mobile --template blank-typescript
cd mobile
```

### 2. Install Core Dependencies

```bash
# Navigation
npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-screens react-native-safe-area-context

# Styling
npx expo install nativewind tailwindcss react-native-reanimated

# State & Data
npm install @tanstack/react-query zustand axios

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Auth & Storage
npx expo install expo-secure-store

# UI Enhancements
npx expo install expo-haptics expo-blur expo-image
npm install react-native-gesture-handler moti

# Icons (match web app)
npm install lucide-react-native react-native-svg

# Dev tools
npm install -D jest @testing-library/react-native @types/jest
```

### 3. Configure Expo Router

Update `app.json`:
```json
{
  "expo": {
    "name": "TrainX",
    "slug": "trainx",
    "scheme": "trainx",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": { "image": "./assets/splash.png", "resizeMode": "contain" },
    "plugins": ["expo-router", "expo-secure-store"],
    "experiments": { "typedRoutes": true }
  }
}
```

### 4. Configure NativeWind (Tailwind)

Create `tailwind.config.js`:
```js
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Match TrainX web color palette
      },
    },
  },
};
```

### 5. Configure EAS Build

Create `eas.json`:
```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {
      "ios": { "appleId": "YOUR_APPLE_ID", "ascAppId": "YOUR_APP_ID" },
      "android": { "serviceAccountKeyPath": "./play-store-key.json" }
    }
  }
}
```

### 6. Create Shared Types Package

```bash
cd /path/to/TrainX-2.0
mkdir -p shared
```

Move/copy shared Zod schemas and types to `shared/`:
- `shared/validations.ts` — Zod schemas (copied from `src/lib/validations.ts`)
- `shared/types.ts` — Shared TypeScript types

Configure path alias in both `tsconfig.json` files to reference `shared/`.

### 7. Environment Configuration

Create `mobile/.env`:
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Create `mobile/.env.production`:
```
EXPO_PUBLIC_API_URL=https://trainx.vercel.app
```

### 8. Scaffold Directory Structure

Create the folder structure as defined in the Mobile agent's project structure section.

## Verification

After setup, verify:
- [ ] `cd mobile && npx expo start` launches without errors
- [ ] Expo Router serves the root route
- [ ] NativeWind classes apply correctly
- [ ] TypeScript compiles without errors
- [ ] Shared types are importable from `shared/`

## Notes
- Use managed workflow (don't eject)
- Pin Expo SDK version for team consistency
- Add `mobile/node_modules/` to `.gitignore`
