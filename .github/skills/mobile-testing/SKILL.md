---
name: mobile-testing
description: 'Testing patterns and procedures for the TrainX mobile app. Use when: writing unit tests, component tests, E2E tests with Maestro, setting up test infrastructure, running mobile test suites.'
argument-hint: 'Run this skill for mobile testing setup and patterns'
---

# Mobile Testing Skill

## When to Use
- Setting up the mobile testing infrastructure
- Writing unit tests for hooks and utilities
- Writing component tests with React Native Testing Library
- Writing E2E tests with Maestro
- Running the full test suite before release

## Test Pyramid

```
        ┌──────────┐
        │   E2E    │  Maestro flows (critical paths only)
        │  (few)   │
       ┌┴──────────┴┐
       │ Component   │  RNTL (screens & components)
       │  (many)     │
      ┌┴────────────┴┐
      │    Unit       │  Jest (hooks, utils, api-client)
      │  (most)       │
      └───────────────┘
```

## 1. Unit Tests (Jest)

**Location:** `mobile/__tests__/` or co-located `*.test.ts`

### What to Test
- `lib/api-client.ts` — Request building, error handling, token injection
- `lib/auth.ts` — Token storage, validation, refresh logic
- `lib/utils.ts` — Formatters, helpers
- Zod schema validation (shared schemas)
- Custom hooks (with `renderHook`)

### Example

```typescript
// __tests__/lib/api-client.test.ts
import { apiClient } from '../../lib/api-client';

describe('API Client', () => {
  it('includes auth token in headers', async () => {
    // Mock SecureStore to return a token
    // Assert fetch was called with Authorization header
  });

  it('throws AuthExpiredError on 401', async () => {
    // Mock fetch to return 401
    // Assert error type
  });
});
```

## 2. Component Tests (React Native Testing Library)

**Location:** `mobile/__tests__/components/` or co-located

### What to Test
- Screens render correct content based on role (coach/athlete)
- Forms validate input and show errors
- Loading/error/empty states render correctly
- User interactions trigger correct callbacks
- Navigation happens on button press

### Setup

```typescript
// jest.setup.ts
import '@testing-library/react-native/extend-expect';

// Mock expo modules
jest.mock('expo-secure-store');
jest.mock('expo-haptics');
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
}));
```

### Example

```typescript
// __tests__/screens/login.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../app/(auth)/login';

describe('Login Screen', () => {
  it('shows validation error for empty email', async () => {
    const { getByText, getByTestId } = render(<LoginScreen />);
    fireEvent.press(getByTestId('login-button'));
    await waitFor(() => {
      expect(getByText('Invalid email address')).toBeTruthy();
    });
  });

  it('calls login API with credentials', async () => {
    // Fill form, press submit, assert API call
  });
});
```

## 3. E2E Tests (Maestro)

**Location:** `mobile/maestro/`

### Setup

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Run flows
maestro test maestro/
```

### Critical Flows to Automate

```yaml
# maestro/auth/login-coach.yaml
appId: com.trainx.app
---
- launchApp
- tapOn: "Email"
- inputText: "coach@test.com"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Sign In"
- assertVisible: "Dashboard"
- assertVisible: "Athletes"
```

```yaml
# maestro/athlete/complete-session.yaml
appId: com.trainx.app
---
- launchApp
- tapOn: "Email"
- inputText: "athlete@test.com"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Sign In"
- assertVisible: "This Week"
- tapOn: "Monday.*" # First session
- assertVisible: "Exercises"
- tapOn: "Mark Complete"
- assertVisible: "Rate Your Session"
- tapOn: "7" # RPE
- tapOn: "Submit"
- assertVisible: "Completed"
```

### Maestro Flow Checklist

| Flow | File | Priority |
|------|------|----------|
| Coach login | `auth/login-coach.yaml` | P0 |
| Athlete login | `auth/login-athlete.yaml` | P0 |
| Register new user | `auth/register.yaml` | P0 |
| Coach views athletes | `coach/view-athletes.yaml` | P1 |
| Coach creates plan | `coach/create-plan.yaml` | P1 |
| Athlete views plan | `athlete/view-plan.yaml` | P1 |
| Athlete completes session | `athlete/complete-session.yaml` | P0 |
| Coach gives feedback | `coach/give-feedback.yaml` | P1 |
| Profile update | `shared/update-profile.yaml` | P2 |
| Logout | `auth/logout.yaml` | P1 |

## 4. Running Tests

```bash
# Unit + Component tests
cd mobile && npm test

# With coverage
npm test -- --coverage

# Single file
npm test -- --testPathPattern="api-client"

# E2E (requires running app)
npx expo start --dev-client &
maestro test maestro/

# E2E single flow
maestro test maestro/auth/login-coach.yaml
```

## 5. CI Integration

```yaml
# .github/workflows/mobile-tests.yml
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cd mobile && npm ci && npm test -- --coverage

  e2e-tests:
    runs-on: macos-latest  # Needed for iOS simulator
    steps:
      - uses: actions/checkout@v4
      - run: cd mobile && npm ci
      - run: curl -Ls "https://get.maestro.mobile.dev" | bash
      - run: npx expo prebuild --platform ios
      - run: maestro test maestro/
```

## Coverage Targets

| Layer | Target | 
|-------|--------|
| Utils / Lib | ≥ 90% |
| Hooks | ≥ 80% |
| Components | ≥ 70% |
| Screens | ≥ 60% |
| E2E flows | All P0 + P1 |
