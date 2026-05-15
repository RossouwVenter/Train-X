import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter, useSegments } from "expo-router";
import { tokenStorage } from "@/lib/storage";
import { api, ApiError } from "@/lib/api-client";

type Role = "COACH" | "ATHLETE";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    coachId?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Check stored auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Protect routes based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, segments, isLoading]);

  const checkAuth = async () => {
    try {
      const storedUser = await tokenStorage.getUser();
      const token = await tokenStorage.getToken();

      if (storedUser && token) {
        // Validate token is still valid
        try {
          const session = await api.get<{ data: { user: User } }>(
            "/api/auth/mobile/session"
          );
          setUser(session.data.user);
        } catch {
          // Token expired or invalid
          await tokenStorage.clearAll();
          setUser(null);
        }
      }
    } catch {
      await tokenStorage.clearAll();
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<{
      data: { token: string; user: User };
    }>("/api/auth/mobile/login", { email, password });

    const { token, user: userData } = response.data;
    await tokenStorage.setToken(token);
    await tokenStorage.setUser(userData);
    setUser(userData);
  }, []);

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      role: string;
      coachId?: string;
    }) => {
      const response = await api.post<{
        data: { token: string; user: User };
      }>("/api/auth/mobile/register", data);

      const { token, user: userData } = response.data;
      await tokenStorage.setToken(token);
      await tokenStorage.setUser(userData);
      setUser(userData);
    },
    []
  );

  const logout = useCallback(async () => {
    await tokenStorage.clearAll();
    setUser(null);
    router.replace("/(auth)/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
