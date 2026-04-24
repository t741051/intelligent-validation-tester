"use client";
import { Plus } from "lucide-react";
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/60 border-b">
                <th className="py-2 pr-2">Code</th>
                <th className="py-2 pr-2">名稱</th>
                <th className="py-2 pr-2">類型</th>
                <th className="py-2 pr-2">管理 IP</th>
                <th className="py-2 pr-2">廠商</th>
                <th className="py-2 pr-2">狀態</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {stations.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-2 pr-2 font-mono text-xs">{s.code}</td>
                  <td className="py-2 pr-2">{s.name}</td>
                  <td className="py-2 pr-2 uppercase">{s.node_type}</td>
                  <td className="py-2 pr-2 font-mono text-xs text-white/70">
                    {s.mgmt_ip ? (
                      <>
                        {s.mgmt_ip}
                        {s.mgmt_port ? `:${s.mgmt_port}` : ""}
                      </>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </td>
                  <td className="py-2 pr-2 text-white/70">
                    {s.vendor || <span className="text-white/40">-</span>}
                  </td>
                  <td className="py-2 pr-2">
                    <Badge tone={STATUS_TONE[s.status] ?? "gray"}>
                      {STATUS_LABEL[s.status] ?? s.status}
                    </Badge>
                  </td>
                  <td className="py-2 text-right">
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`移除網元 ${s.code}?`)) {
                            deleteStation.mutate(s.code);
                          }
                        }}
                      >
                        刪除
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
