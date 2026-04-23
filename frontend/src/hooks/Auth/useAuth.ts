"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/stores/authStore";

export function useAuth(options: { requireAuth?: boolean } = {}) {
  const { user, token, hasHydrated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (options.requireAuth && !token) {
      router.replace("/login");
    }
  }, [options.requireAuth, token, hasHydrated, router]);

  return {
    user,
    token,
    hasHydrated,
    isAuthenticated: hasHydrated && !!token,
    logout: () => {
      logout();
      router.replace("/login");
    },
  };
}
