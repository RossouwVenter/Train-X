---
name: mobile-api-client
description: 'Build a typed API client for the React Native app that communicates with the existing Next.js backend. Use when: setting up API integration, creating authenticated fetch wrapper, implementing token management, building TanStack Query hooks.'
argument-hint: 'Run this skill to create the mobile API client and auth layer'
---

# Mobile API Client Skill

## When to Use
- Setting up the API client in `mobile/lib/`
- Creating authenticated fetch wrapper with token management
- Building TanStack Query hooks for data fetching
- Integrating mobile auth with the existing NextAuth backend

## Architecture

```
mobile/lib/api-client.ts     ← Core HTTP client with auth headers
mobile/lib/auth.ts           ← Token storage/retrieval (SecureStore)
mobile/lib/storage.ts        ← SecureStore wrapper
mobile/hooks/useAuth.ts      ← Auth context provider + hook
mobile/hooks/useApi.ts       ← TanStack Query hooks for each endpoint
```

## API Endpoints (existing backend)

The mobile app talks to the same Next.js API routes:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/callback/credentials` | Login (email + password) |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/session` | Validate current session |
| POST | `/api/auth/delete-account` | Delete user account |
| GET | `/api/athletes` | List coach's athletes |
| GET | `/api/sessions` | Get training sessions |
| POST | `/api/sessions/log` | Log session completion |
| POST | `/api/auth/reset-password` | Reset password |

## Implementation Pattern

### 1. Secure Token Storage

```typescript
// mobile/lib/storage.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'trainx_auth_token';
const REFRESH_KEY = 'trainx_refresh_token';

export const tokenStorage = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  removeToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),
  // ...refresh token methods
};
```

### 2. Authenticated HTTP Client

```typescript
// mobile/lib/api-client.ts
import { tokenStorage } from './storage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

async function authenticatedFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await tokenStorage.getToken();
  
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired — trigger re-login
    await tokenStorage.removeToken();
    throw new AuthExpiredError();
  }

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.error, error.code, response.status);
  }

  return response.json();
}
```

### 3. TanStack Query Hooks

```typescript
// mobile/hooks/useApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';

export function useAthletes() {
  return useQuery({
    queryKey: ['athletes'],
    queryFn: () => api.get('/api/athletes'),
  });
}

export function useLogSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SessionLogInput) => api.post('/api/sessions/log', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
```

### 4. Auth Context

```typescript
// mobile/hooks/useAuth.ts
// Provides: login, logout, register, user, isAuthenticated, isLoading
// Wraps the entire app in _layout.tsx
// On mount: check SecureStore for token → validate → set user state
```

## Backend Compatibility Notes

The existing Next.js backend uses cookie-based auth (NextAuth). For mobile:

**Option A — JWT Bearer tokens:** Add a mobile-specific auth endpoint that returns a JWT instead of setting cookies. This requires a small backend change.

**Option B — Cookie forwarding:** Use `credentials: 'include'` and let the HTTP client manage cookies. Works but less standard for mobile.

**Recommendation:** Option A — add a `/api/auth/mobile/login` endpoint that returns `{ token, user }`. This keeps mobile auth clean and stateless.

## Security Checklist

- [ ] Tokens in SecureStore only (never AsyncStorage)
- [ ] HTTPS enforced for all API calls
- [ ] Token refresh before expiry
- [ ] Clear tokens on logout
- [ ] No sensitive data in console.log (strip in production)
- [ ] Certificate pinning for production (optional but recommended)

## Verification

- [ ] Login flow returns and stores token
- [ ] Authenticated requests include token header
- [ ] 401 response triggers re-login
- [ ] Logout clears stored tokens
- [ ] TanStack Query caches and refetches correctly
