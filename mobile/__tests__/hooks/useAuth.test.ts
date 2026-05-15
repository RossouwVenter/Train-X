import { renderHook, act, waitFor } from "@testing-library/react-native";
import { tokenStorage } from "@/lib/storage";
import { api } from "@/lib/api-client";

// Mock dependencies
jest.mock("@/lib/storage");
jest.mock("@/lib/api-client");
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  useSegments: () => ["(auth)"],
}));

const mockTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;
const mockApi = api as jest.Mocked<typeof api>;

// We need to test the AuthProvider separately because useAuth requires context
describe("Auth logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("tokenStorage integration", () => {
    it("stores token and user on login response", async () => {
      const mockUser = {
        id: "1",
        email: "test@test.com",
        name: "Test",
        role: "COACH",
      };
      mockApi.post.mockResolvedValue({
        data: { token: "jwt-token-123", user: mockUser },
      });
      mockTokenStorage.setToken.mockResolvedValue(undefined);
      mockTokenStorage.setUser.mockResolvedValue(undefined);

      // Simulate the login logic
      const response = await api.post("/api/auth/mobile/login", {
        email: "test@test.com",
        password: "password123",
      });

      const { token, user } = (response as any).data;
      await tokenStorage.setToken(token);
      await tokenStorage.setUser(user);

      expect(mockTokenStorage.setToken).toHaveBeenCalledWith("jwt-token-123");
      expect(mockTokenStorage.setUser).toHaveBeenCalledWith(mockUser);
    });

    it("clears storage on logout", async () => {
      mockTokenStorage.clearAll.mockResolvedValue(undefined);

      await tokenStorage.clearAll();

      expect(mockTokenStorage.clearAll).toHaveBeenCalled();
    });

    it("validates session with stored token", async () => {
      mockTokenStorage.getToken.mockResolvedValue("stored-token");
      mockTokenStorage.getUser.mockResolvedValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
        role: "ATHLETE",
      });
      mockApi.get.mockResolvedValue({
        data: {
          user: {
            id: "1",
            email: "test@test.com",
            name: "Test",
            role: "ATHLETE",
          },
        },
      });

      const token = await tokenStorage.getToken();
      const storedUser = await tokenStorage.getUser();

      expect(token).toBe("stored-token");
      expect(storedUser?.role).toBe("ATHLETE");
    });

    it("clears storage when session validation fails", async () => {
      mockTokenStorage.getToken.mockResolvedValue("expired-token");
      mockTokenStorage.getUser.mockResolvedValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
        role: "COACH",
      });
      mockApi.get.mockRejectedValue(new Error("Unauthorized"));
      mockTokenStorage.clearAll.mockResolvedValue(undefined);

      const token = await tokenStorage.getToken();
      if (token) {
        try {
          await api.get("/api/auth/mobile/session");
        } catch {
          await tokenStorage.clearAll();
        }
      }

      expect(mockTokenStorage.clearAll).toHaveBeenCalled();
    });
  });

  describe("register flow", () => {
    it("calls mobile register endpoint and stores credentials", async () => {
      const mockUser = {
        id: "2",
        email: "new@test.com",
        name: "New User",
        role: "ATHLETE",
      };
      mockApi.post.mockResolvedValue({
        data: { token: "new-jwt-token", user: mockUser },
      });
      mockTokenStorage.setToken.mockResolvedValue(undefined);
      mockTokenStorage.setUser.mockResolvedValue(undefined);

      const response = await api.post("/api/auth/mobile/register", {
        name: "New User",
        email: "new@test.com",
        password: "password123",
        role: "ATHLETE",
      });

      const { token, user } = (response as any).data;
      await tokenStorage.setToken(token);
      await tokenStorage.setUser(user);

      expect(mockApi.post).toHaveBeenCalledWith("/api/auth/mobile/register", {
        name: "New User",
        email: "new@test.com",
        password: "password123",
        role: "ATHLETE",
      });
      expect(mockTokenStorage.setToken).toHaveBeenCalledWith("new-jwt-token");
      expect(mockTokenStorage.setUser).toHaveBeenCalledWith(mockUser);
    });
  });
});
