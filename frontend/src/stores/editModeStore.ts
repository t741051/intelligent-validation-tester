"use client";
import { create } from "zustand";

type EditModeState = {
  isEditing: boolean;
  toggle: () => void;
  setEditing: (v: boolean) => void;
};

export const useEditModeStore = create<EditModeState>((set) => ({
  isEditing: false,
  toggle: () => set((s) => ({ isEditing: !s.isEditing })),
  setEditing: (v) => set({ isEditing: v }),
}));

export const useIsEditing = () => useEditModeStore((s) => s.isEditing);
