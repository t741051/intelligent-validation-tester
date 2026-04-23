import type { LoginResponse, User } from "@/types/auth";

import { apiClient } from "../api/client";

export const authService = {
  async login(identifier: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post("/auth/login/", { identifier, password });
    return data;
  },
  async me(): Promise<User> {
    const { data } = await apiClient.get("/auth/me/");
    return data;
  },
  async changePassword(old_password: string, new_password: string): Promise<void> {
    await apiClient.post("/auth/change-password/", { old_password, new_password });
  },
};
