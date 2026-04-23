"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/services";
import { useAuthStore } from "@/stores/authStore";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const mutation = useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      authService.login(identifier, password),
    onSuccess: (data) => {
      setAuth(data.user, data.access, data.refresh);
      router.push("/overview");
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
