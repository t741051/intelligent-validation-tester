"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { useDeleteSite } from "@/hooks/Site/useSites";
import { useIsEditing } from "@/stores/editModeStore";
import type { Site } from "@/types/site";

const ENV_LABEL: Record<string, string> = { indoor: "室內", outdoor: "室外" };

export function SiteList({
  sites,
  selectedId,
  onSelect,
}: {
  sites: Site[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const del = useDeleteSite();
  const isEditing = useIsEditing();

  if (sites.length === 0) {
    return (
      <div className="text-center text-white/40 py-12 border border-dashed rounded-item">
        尚未建立場域
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sites.map((s) => {
        const active = s.id === selectedId;
        return (
          <Card
            key={s.id}
            className={cn(
              "p-3 cursor-pointer transition-colors",
              active ? "ring-2 ring-mint-300" : "hover:bg-white/5",
            )}
            onClick={() => onSelect(s.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-lg font-semibold leading-tight truncate">
                  {s.name}
                </div>
                <div className="mt-0.5 text-xs text-white/50 truncate">
                  {s.address || "—"}
                </div>
              </div>
              <Badge tone={s.environment === "outdoor" ? "blue" : "gray"}>
                {ENV_LABEL[s.environment] ?? s.environment}
              </Badge>
            </div>
            {isEditing && (
              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`刪除場域「${s.name}」?`)) del.mutate(s.id);
                  }}
                >
                  刪除
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
