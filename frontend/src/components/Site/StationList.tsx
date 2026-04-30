"use client";
import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useCreateStation,
  useDeleteStation,
} from "@/hooks/Site/useSiteTopology";
import { useIsEditing } from "@/stores/editModeStore";
import type { BaseStation } from "@/types/site";

import { StationFormDialog } from "./StationFormDialog";

const STATUS_TONE: Record<string, "green" | "orange" | "gray"> = {
  normal: "green",
  warning: "orange",
  offline: "gray",
};

const STATUS_LABEL: Record<string, string> = {
  normal: "正常",
  warning: "需關注",
  offline: "離線",
};

export function StationList({
  siteId,
  stations,
}: {
  siteId: string;
  stations: BaseStation[];
}) {
  const createStation = useCreateStation(siteId);
  const deleteStation = useDeleteStation(siteId);
  const [formOpen, setFormOpen] = useState(false);
  const isEditing = useIsEditing();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-white/60">{stations.length} 個網元</div>
        {isEditing && (
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> 新增網元
          </Button>
        )}
      </div>
      {stations.length === 0 ? (
        <p className="text-sm text-white/40">此場域尚無網元。</p>
      ) : (
        <div className="space-y-2">
          {stations.map((s) => (
            <details
              key={s.id}
              className="group border border-white/10 rounded-item bg-white/[0.02]"
            >
              <summary className="p-3 flex items-center gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <ChevronRight className="w-4 h-4 text-white/40 transition-transform group-open:rotate-90 flex-shrink-0" />
                <span className="font-mono text-xs text-white/70 flex-shrink-0">
                  {s.code}
                </span>
                <span className="font-medium truncate min-w-0 flex-1">{s.name}</span>
                <Badge tone="gray" className="uppercase flex-shrink-0">
                  {s.node_type}
                </Badge>
                <Badge tone={STATUS_TONE[s.status] ?? "gray"} className="flex-shrink-0">
                  {STATUS_LABEL[s.status] ?? s.status}
                </Badge>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (confirm(`移除網元 ${s.code}?`)) {
                        deleteStation.mutate(s.code);
                      }
                    }}
                  >
                    刪除
                  </Button>
                )}
              </summary>
              <div className="px-3 pb-3 text-sm text-white/70 space-y-1 border-t border-white/5 pt-2">
                <div>
                  <span className="text-white/40">管理 IP:</span>{" "}
                  <span className="font-mono">
                    {s.mgmt_ip
                      ? `${s.mgmt_ip}${s.mgmt_port ? `:${s.mgmt_port}` : ""}`
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-white/40">廠商:</span> {s.vendor || "—"}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
      <StationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isSubmitting={createStation.isPending}
        onSubmit={async (input) => {
          await createStation.mutateAsync(input);
          setFormOpen(false);
        }}
      />
    </div>
  );
}
