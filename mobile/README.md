# TrainX Mobile App

React Native mobile app built with Expo SDK 52, Expo Router, and NativeWind.

## Quick Start

```bash
cd mobile
npm install
npx expo start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan QR with Expo Go.

## Architecture

```
mobile/
├── app/              # Expo Router file-based routes
│   ├── (auth)/       # Login, Register, Forgot Password
│   ├── (tabs)/       # Main app (Home, Plans, Progress, Profile)
│   └── _layout.tsx   # Root layout (providers)
├── components/       # Reusable UI components
├── hooks/            # Custom hooks (useAuth, etc.)
├── lib/              # Utilities (api-client, storage)
├── constants/        # Colors, config
└── __tests__/        # Unit tests
```

## Auth Flow

- Uses JWT Bearer tokens (separate from web's cookie-based NextAuth)
- Tokens stored in `expo-secure-store`
- Auto-redirects to login on 401 responses
- Session validated on app launch

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm test` | Run unit tests |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Building

```bash
# Development build (includes dev tools)
eas build --profile development --platform ios

# Preview (TestFlight/internal testing)
eas build --profile preview --platform all

# Production
eas build --profile production --platform all
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `EXPO_PUBLIC_API_URL` — Backend API URL (defaults to `http://localhost:3000`)
