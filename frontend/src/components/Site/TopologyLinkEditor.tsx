"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateTopology } from "@/hooks/Site/useSiteTopology";
import { useIsEditing } from "@/stores/editModeStore";
import type { BaseStation, TopologyLink } from "@/types/site";

export function TopologyLinkEditor({
  siteId,
  stations,
  links,
}: {
  siteId: string;
  stations: BaseStation[];
  links: TopologyLink[];
}) {
  const update = useUpdateTopology(siteId);
  const isEditing = useIsEditing();
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [bandwidth, setBandwidth] = useState("");

  const nameById = new Map(stations.map((s) => [s.id, `${s.code}`]));

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !target || source === target) return;
    const next = [
      ...links.map((l) => ({
        source: l.source,
        target: l.target,
        bandwidth: l.bandwidth,
        latency_ms: l.latency_ms,
        status: l.status,
      })),
      { source, target, bandwidth, status: "normal" },
    ];
    await update.mutateAsync(next);
    setBandwidth("");
  };

  const removeLink = async (id: string) => {
    const next = links
      .filter((l) => l.id !== id)
      .map((l) => ({
        source: l.source,
        target: l.target,
        bandwidth: l.bandwidth,
        latency_ms: l.latency_ms,
        status: l.status,
      }));
    await update.mutateAsync(next);
  };

  return (
    <div>
      {isEditing && (
      <form onSubmit={addLink} className="flex flex-wrap items-center gap-2 mb-3">
        <select
          className="h-9 rounded-item border border-white/20 bg-navy-400 text-white px-2 text-sm"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        >
          <option value="">Source…</option>
          {stations.map((s) => (
            <option key={s.id} value={s.id}>{s.code}</option>
          ))}
        </select>
        <span className="text-white/40">→</span>
        <select
          className="h-9 rounded-item border border-white/20 bg-navy-400 text-white px-2 text-sm"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
        >
          <option value="">Target…</option>
          {stations.map((s) => (
            <option key={s.id} value={s.id}>{s.code}</option>
          ))}
        </select>
        <Input
          className="w-28"
          placeholder="頻寬"
          value={bandwidth}
          onChange={(e) => setBandwidth(e.target.value)}
        />
        <Button
          type="submit"
          size="sm"
          disabled={update.isPending || stations.length < 2}
        >
          + 新增連線
        </Button>
      </form>
      )}
      {links.length === 0 ? (
        <p className="text-sm text-white/40">尚無拓樸連線。</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {links.map((l) => (
            <li
              key={l.id}
              className="flex items-center justify-between border-b last:border-0 py-1"
            >
              <span>
                <span className="font-mono text-xs">
                  {nameById.get(l.source) ?? "?"} → {nameById.get(l.target) ?? "?"}
                </span>
                {l.bandwidth && (
                  <span className="ml-2 text-white/60">{l.bandwidth}</span>
                )}
              </span>
              {isEditing && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeLink(l.id)}
                >
                  移除
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
