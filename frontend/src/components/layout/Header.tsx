"use client";
import { LogOut, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/Auth/useAuth";
import { useUiStore } from "@/stores/uiStore";

export function Header() {
  const { user, logout } = useAuth();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="h-14 border-b border-white/10 bg-navy-600/70 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 gap-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-white/70 hidden sm:inline">
            {user.email} <span className="text-white/40">({user.role})</span>
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
