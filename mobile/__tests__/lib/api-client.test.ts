import { api, ApiError, AuthExpiredError } from "../../lib/api-client";
import * as SecureStore from "expo-secure-store";

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("api-client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("test-token");
  });

  describe("GET requests", () => {
    it("sends GET request with auth header", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: { id: "1" } }),
      });

      const result = await api.get("/api/athletes");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/athletes"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        })
      );
      expect(result).toEqual({ data: { id: "1" } });
    });

    it("omits auth header when no token stored", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {} }),
      });

      await api.get("/api/public");

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers.Authorization).toBeUndefined();
    });
  });

  describe("POST requests", () => {
    it("sends POST with JSON body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: { success: true } }),
      });

      await api.post("/api/sessions/log", { sessionId: "s1", rpe: 7 });

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe("POST");
      expect(options.body).toBe(JSON.stringify({ sessionId: "s1", rpe: 7 }));
    });
  });

  describe("error handling", () => {
    it("throws AuthExpiredError on 401", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: "Unauthorized", code: "UNAUTHORIZED" }),
      });

      await expect(api.get("/api/protected")).rejects.toThrow(AuthExpiredError);
      // Should clear stored tokens
      expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
    });

    it("throws ApiError on non-401 errors", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({ error: "Validation failed", code: "VALIDATION_ERROR" }),
      });

      await expect(api.post("/api/test", {})).rejects.toThrow(ApiError);

      try {
        await api.post("/api/test", {});
      } catch (err) {
        expect((err as ApiError).code).toBe("VALIDATION_ERROR");
        expect((err as ApiError).status).toBe(400);
      }
    });

    it("handles 204 No Content", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
      });

      const result = await api.delete("/api/resource/1");
      expect(result).toBeUndefined();
    });
  });
});
