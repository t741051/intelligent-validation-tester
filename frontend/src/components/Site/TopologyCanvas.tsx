"use client";
import type { BaseStation, NodeType, TopologyLink } from "@/types/site";

const NODE_ICON: Record<string, string> = {
  gnb: "📡",
  smo: "🖥️",
  ric: "🧠",
};

const STATUS_COLOR: Record<string, string> = {
  normal: "#22c55e",
  warning: "#f59e0b",
  offline: "#9ca3af",
};

// Vertical position per layer (percent). Top→Bottom: management → control → radio.
const LAYER_Y: Record<NodeType, number> = {
  smo: 20,
  ric: 50,
  gnb: 82,
};
const LAYER_ORDER: NodeType[] = ["smo", "ric", "gnb"];

function computeLayout(stations: BaseStation[]): Map<string, { x: number; y: number }> {
  const layout = new Map<string, { x: number; y: number }>();
  for (const layer of LAYER_ORDER) {
    const inLayer = stations.filter((s) => s.node_type === layer);
    inLayer.forEach((s, i) => {
      const step = 100 / (inLayer.length + 1);
      layout.set(s.id, { x: step * (i + 1), y: LAYER_Y[layer] });
    });
  }
  return layout;
}

export function TopologyCanvas({
  stations,
  links,
}: {
  stations: BaseStation[];
  links: TopologyLink[];
}) {
  const layout = computeLayout(stations);

  return (
    <div className="relative w-full aspect-[2/1] bg-navy-700/40 border border-white/10 rounded-section overflow-hidden">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {links.map((l) => {
          const src = layout.get(l.source);
          const tgt = layout.get(l.target);
          if (!src || !tgt) return null;
          return (
            <line
              key={l.id}
              x1={`${src.x}%`}
              y1={`${src.y}%`}
              x2={`${tgt.x}%`}
              y2={`${tgt.y}%`}
              stroke={STATUS_COLOR[l.status] ?? "#9ca3af"}
              strokeWidth={2}
              strokeDasharray={l.status === "offline" ? "4 4" : undefined}
            />
          );
        })}
      </svg>
      {stations.map((s) => {
        const pos = layout.get(s.id);
        if (!pos) return null;
        return (
          <div
            key={s.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div
              className="w-10 h-10 rounded-full bg-navy-500 border-2 flex items-center justify-center text-lg shadow-sm"
              style={{ borderColor: STATUS_COLOR[s.status] ?? "#576378" }}
              title={`${s.code} · ${s.name}`}
            >
              {NODE_ICON[s.node_type] ?? "●"}
            </div>
            <div className="mt-1 text-xs text-white/80 bg-navy-500/80 px-1 rounded">
              {s.code}
            </div>
          </div>
        );
      })}
      {stations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-white/40">
          尚未加入網元
        </div>
      )}
    </div>
  );
}
