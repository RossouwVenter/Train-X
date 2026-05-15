import * as SecureStore from "expo-secure-store";
import { tokenStorage } from "../../lib/storage";

describe("tokenStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getToken", () => {
    it("retrieves token from SecureStore", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("test-token");
      const token = await tokenStorage.getToken();
      expect(token).toBe("test-token");
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("trainx_auth_token");
    });

    it("returns null when no token stored", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      const token = await tokenStorage.getToken();
      expect(token).toBeNull();
    });
  });

  describe("setToken", () => {
    it("stores token in SecureStore", async () => {
      await tokenStorage.setToken("my-token");
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "trainx_auth_token",
        "my-token"
      );
    });
  });

  describe("removeToken", () => {
    it("deletes token from SecureStore", async () => {
      await tokenStorage.removeToken();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("trainx_auth_token");
    });
  });

  describe("getUser", () => {
    it("parses stored JSON user", async () => {
      const user = { id: "1", name: "Test", email: "test@test.com", role: "ATHLETE" };
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify(user));
      const result = await tokenStorage.getUser();
      expect(result).toEqual(user);
    });

    it("returns null for invalid JSON", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("invalid-json");
      const result = await tokenStorage.getUser();
      expect(result).toBeNull();
    });

    it("returns null when no user stored", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      const result = await tokenStorage.getUser();
      expect(result).toBeNull();
    });
  });

  describe("clearAll", () => {
    it("removes both token and user", async () => {
      await tokenStorage.clearAll();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("trainx_auth_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("trainx_user");
    });
  });
});
