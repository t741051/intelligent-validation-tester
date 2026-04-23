import type { LoginResponse, User } from "@/types/auth";

const MOCK_USER: User = {
  id: "11111111-1111-1111-1111-111111111111",
  email: "admin@ivt.local",
  username: "admin",
  role: "admin",
  must_change_password: false,
};

export const mockAuthService = {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    await new Promise((r) => setTimeout(r, 300));
    const ok = (identifier === "admin@ivt.local" || identifier === "admin") && password === "admin";
    if (!ok) {
      throw Object.assign(new Error("Invalid credentials"), { response: { status: 401 } });
    }
    return { access: "mock-access", refresh: "mock-refresh", user: MOCK_USER };
  },
  async me(): Promise<User> {
    return MOCK_USER;
  },
  async changePassword(): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
  },
};
