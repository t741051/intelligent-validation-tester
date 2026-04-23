"use client";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/Auth/useAuth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth({ requireAuth: true });
  if (!isAuthenticated) return null;
  return <AppShell>{children}</AppShell>;
}
