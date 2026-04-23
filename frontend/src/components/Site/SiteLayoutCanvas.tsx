"use client";
import { useRef, useState } from "react";

import { useUpdateStation } from "@/hooks/Site/useSiteTopology";
import type { BaseStation } from "@/types/site";

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

function clampPct(v: number) {
  return Math.max(2, Math.min(98, Math.round(v * 10) / 10));
}

export function SiteLayoutCanvas({ siteId, floorPlanUrl, stations }: Props) {
  const update = useUpdateStation(siteId);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{
    id: string;
    code: string;
    x: number;
    y: number;
  } | null>(null);

  const gnbs = stations.filter((s) => s.node_type === "gnb");

  const pointerPct = (e: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: clampPct(((e.clientX - rect.left) / rect.width) * 100),
      y: clampPct(((e.clientY - rect.top) / rect.height) * 100),
    };
  };

  const startDrag = (e: React.PointerEvent, s: BaseStation) => {
    e.preventDefault();
    setDragging({ id: s.id, code: s.code, x: s.position.x, y: s.position.y });
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const p = pointerPct(e);
    if (!p) return;
    setDragging({ ...dragging, ...p });
  };

  const onDrop = async (e: React.PointerEvent) => {
    if (!dragging) return;
    const p = pointerPct(e) ?? { x: dragging.x, y: dragging.y };
    const moved = { ...dragging, ...p };
    setDragging(null);
    await update.mutateAsync({
      code: moved.code,
      input: { position: { x: moved.x, y: moved.y } },
    });
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full aspect-[2/1] rounded-lg border overflow-hidden select-none"
      style={
        floorPlanUrl
          ? {
              backgroundImage: `url(${floorPlanUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "#f9fafb",
            }
          : {
              backgroundColor: "#f9fafb",
              backgroundImage:
                "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
              backgroundSize: "5% 5%",
            }
      }
      onPointerMove={onMove}
      onPointerUp={onDrop}
      onPointerLeave={onDrop}
    >
      {gnbs.map((s) => {
        const active = dragging?.id === s.id;
        const x = active ? dragging.x : s.position.x;
        const y = active ? dragging.y : s.position.y;
        return (
          <button
            key={s.id}
            type="button"
            onPointerDown={(e) => startDrag(e, s)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center touch-none cursor-grab active:cursor-grabbing"
            style={{ left: `${x}%`, top: `${y}%` }}
            title={`${s.code} · ${s.name} (${s.position.x}%, ${s.position.y}%)`}
          >
            <div
              className="w-9 h-9 rounded-full bg-white border-2 flex items-center justify-center text-base shadow-sm"
              style={{ borderColor: STATUS_COLOR[s.status] ?? "#9ca3af" }}
            >
              📡
            </div>
            <div className="mt-1 text-xs font-medium text-gray-700 bg-white/80 px-1 rounded">
              {s.code}
            </div>
          </button>
        );
      })}
      {gnbs.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 pointer-events-none">
          尚未加入 gNB
        </div>
      )}
      <div className="absolute bottom-1 right-2 text-[10px] text-gray-400 bg-white/70 px-1 rounded pointer-events-none">
        拖拉圖示調整位置
      </div>
    </div>
  );
}
