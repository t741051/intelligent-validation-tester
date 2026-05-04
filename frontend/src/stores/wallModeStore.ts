"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WallModeState = {
  isWall: boolean;
  /** 是否顯示 bezel 視覺指示線(電視牆模式下的開發參考用)。 */
  showBezels: boolean;
  toggle: () => void;
  setWall: (v: boolean) => void;
  toggleBezels: () => void;
};

/**
 * 電視牆模式 — 整體 UI 放大、間距加大、bezel safe zone 啟用。
 * 目標解析度 11520×3240(6×3 顆 1920×1080 螢幕拼接,單條 HDMI 直出)。
 *
 * 偵測 / 自動切換:故意不做。一律以使用者明確按 Header 的 Tv 切換為準,
 * 方便在筆電上預覽 wall layout(配合瀏覽器 Ctrl+- 縮小看全貌)。
 *
 * 用 persist 把選擇記到 localStorage,重新整理 / 重開分頁仍維持狀態。
 */
export const useWallModeStore = create<WallModeState>()(
  persist(
    (set) => ({
      isWall: false,
      showBezels: true,
      toggle: () => set((s) => ({ isWall: !s.isWall })),
      setWall: (v) => set({ isWall: v }),
      toggleBezels: () => set((s) => ({ showBezels: !s.showBezels })),
    }),
    { name: "ivt-wall-mode" },
  ),
);

export const useIsWallMode = () => useWallModeStore((s) => s.isWall);
