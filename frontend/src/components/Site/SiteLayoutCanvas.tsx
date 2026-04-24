"use client";
import { useRef, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSiteCameras } from "@/hooks/Site/useSiteCameras";
import { useUpdateStation } from "@/hooks/Site/useSiteTopology";
import { useIsEditing } from "@/stores/editModeStore";
import type { BaseStation, SiteCamera } from "@/types/site";

import { HlsPlayer } from "./HlsPlayer";

const STATUS_COLOR: Record<string, string> = {
  normal: "#22c55e",
  warning: "#f59e0b",
  offline: "#9ca3af",
};

type Props = {
  siteId: string;
  floorPlanUrl?: string;
  stations: BaseStation[];
};

type DragTarget =
  | { kind: "station"; id: string; code: string; x: number; y: number }
  | { kind: "camera"; id: string; x: number; y: number };

function clampPct(v: number) {
  return Math.max(2, Math.min(98, Math.round(v * 10) / 10));
}

const DRAG_THRESHOLD_PX = 4;

export function SiteLayoutCanvas({ siteId, floorPlanUrl, stations }: Props) {
  const updateStation = useUpdateStation(siteId);
  const { cameras, update: updateCamera } = useSiteCameras(siteId);
  const isEditing = useIsEditing();

  const canvasRef = useRef<HTMLDivElement>(null);
  const pressStart = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const [dragging, setDragging] = useState<DragTarget | null>(null);
  const [playing, setPlaying] = useState<SiteCamera | null>(null);

  const gnbs = stations.filter((s) => s.node_type === "gnb");

  const pointerPct = (e: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clampPct(((e.clientX - rect.left) / rect.width) * 100),
      y: clampPct(((e.clientY - rect.top) / rect.height) * 100),
    };
  };

  const startPress = (e: React.PointerEvent, target: DragTarget) => {
    pressStart.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
    if (isEditing) {
      setDragging(target);
      (e.target as Element).setPointerCapture?.(e.pointerId);
    }
  };

  const onMove = (e: React.PointerEvent) => {
    if (pressStart.current) {
      const dx = e.clientX - pressStart.current.x;
      const dy = e.clientY - pressStart.current.y;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) movedRef.current = true;
    }
    if (!dragging) return;
    const p = pointerPct(e);
    if (!p) return;
    setDragging({ ...dragging, ...p });
  };

  const handleCameraClick = (c: SiteCamera) => {
    // Click (no drag movement) plays the camera; drag moved the pin.
    if (movedRef.current) return;
    if (c.hls_url) setPlaying(c);
  };

  const onDrop = async (e: React.PointerEvent) => {
    pressStart.current = null;
    if (!dragging) return;
    const p = pointerPct(e) ?? { x: dragging.x, y: dragging.y };
    const moved = { ...dragging, ...p };
    setDragging(null);
    if (!movedRef.current) return; // treat as click, no save
    if (moved.kind === "station") {
      await updateStation.mutateAsync({
        code: moved.code,
        input: { position: { x: moved.x, y: moved.y } },
      });
    } else {
      await updateCamera({
        id: moved.id,
        input: { location: { x: moved.x, y: moved.y } },
      });
    }
  };

  return (
    <>
      <div
        ref={canvasRef}
        className="relative w-full aspect-video rounded-section border border-white/10 overflow-hidden select-none"
        style={
          floorPlanUrl
            ? {
                backgroundImage: `url(${floorPlanUrl})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundColor: "#050E1E",
              }
            : {
                backgroundColor: "#050E1E",
                backgroundImage:
                  "linear-gradient(to right, rgba(128,255,232,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,255,232,0.08) 1px, transparent 1px)",
                backgroundSize: "5% 5%",
              }
        }
        onPointerMove={onMove}
        onPointerUp={onDrop}
        onPointerLeave={onDrop}
      >
        {gnbs.map((s) => {
          const active = dragging?.kind === "station" && dragging.id === s.id;
          const x = active ? dragging.x : s.position.x;
          const y = active ? dragging.y : s.position.y;
          return (
            <button
              key={s.id}
              type="button"
              onPointerDown={(e) =>
                startPress(e, {
                  kind: "station",
                  id: s.id,
                  code: s.code,
                  x: s.position.x,
                  y: s.position.y,
                })
              }
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center touch-none ${
                isEditing ? "cursor-grab active:cursor-grabbing" : "cursor-default"
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
              title={`${s.code} · ${s.name}`}
            >
              <div
                className="w-9 h-9 rounded-full bg-navy-500 border-2 flex items-center justify-center text-base shadow-mint-glow"
                style={{ borderColor: STATUS_COLOR[s.status] ?? "#9ca3af" }}
              >
                📡
              </div>
              <div className="mt-1 text-xs font-medium text-white/90 bg-navy-500/80 px-1 rounded">
                {s.code}
              </div>
            </button>
          );
        })}

        {cameras.map((c) => {
          const loc = c.location as { x?: number; y?: number } | null;
          if (loc?.x == null || loc?.y == null) return null;
          const active = dragging?.kind === "camera" && dragging.id === c.id;
          const x = active ? dragging.x : loc.x;
          const y = active ? dragging.y : loc.y;
          const clickable = !!c.hls_url;
          return (
            <button
              key={c.id}
              type="button"
              onPointerDown={(e) =>
                startPress(e, { kind: "camera", id: c.id, x: loc.x as number, y: loc.y as number })
              }
              onClick={() => handleCameraClick(c)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center touch-none ${
                isEditing
                  ? "cursor-grab active:cursor-grabbing"
                  : clickable
                    ? "cursor-pointer"
                    : "cursor-default"
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
              title={`${c.name}${clickable ? " · 點擊播放" : ""}`}
            >
              <div
                className="w-9 h-9 rounded-item bg-navy-500 border-2 flex items-center justify-center text-base shadow-sm"
                style={{ borderColor: c.status === "online" ? "#80FFE8" : "#576378" }}
              >
                📹
              </div>
              <div className="mt-1 text-xs font-medium text-white/90 bg-navy-500/80 px-1 rounded">
                {c.name || c.id.slice(0, 4)}
              </div>
            </button>
          );
        })}

        {gnbs.length === 0 && cameras.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-white/40 pointer-events-none">
            尚未加入 gNB 或攝影機
          </div>
        )}
        {isEditing && (
          <div className="absolute bottom-1 right-2 text-[10px] text-white/60 bg-navy-500/70 border border-white/10 px-1 rounded pointer-events-none">
            拖拉圖示調整位置
          </div>
        )}
      </div>

      <Dialog open={!!playing} onOpenChange={(v) => !v && setPlaying(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{playing?.name}</DialogTitle>
          </DialogHeader>
          {playing?.hls_url && <HlsPlayer src={playing.hls_url} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
