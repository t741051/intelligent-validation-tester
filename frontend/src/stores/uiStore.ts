import { create } from "zustand";

type UiState = {
  sidebarOpen: boolean;
  expandedNavIds: string[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleNavItem: (id: string) => void;
  ensureExpanded: (ids: string[]) => void;
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
  // Add ids only if missing — used on navigation to auto-expand the active
  // branch without overriding any branch the user has manually collapsed.
  ensureExpanded: (ids) =>
    set((s) => {
      const toAdd = ids.filter((id) => !s.expandedNavIds.includes(id));
      return toAdd.length ? { expandedNavIds: [...s.expandedNavIds, ...toAdd] } : s;
    }),
}));
