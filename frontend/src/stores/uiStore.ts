import { create } from "zustand";

type UiState = {
  sidebarOpen: boolean;
  expandedNavIds: string[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleNavItem: (id: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  expandedNavIds: ["interface-validation", "interface-dut"],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleNavItem: (id) =>
    set((s) => ({
      expandedNavIds: s.expandedNavIds.includes(id)
        ? s.expandedNavIds.filter((x) => x !== id)
        : [...s.expandedNavIds, id],
    })),
}));
