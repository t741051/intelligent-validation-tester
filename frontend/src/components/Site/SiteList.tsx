"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { useDeleteSite } from "@/hooks/Site/useSites";
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

  if (sites.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12 border border-dashed rounded-lg">
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
              active ? "ring-2 ring-blue-500" : "hover:bg-gray-50",
            )}
            onClick={() => onSelect(s.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium truncate">{s.name}</div>
                <div className="text-xs text-gray-500 truncate">
                  {s.address || "—"}
                </div>
              </div>
              <Badge tone={s.environment === "outdoor" ? "blue" : "gray"}>
                {ENV_LABEL[s.environment] ?? s.environment}
              </Badge>
            </div>
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
          </Card>
        );
      })}
    </div>
  );
}
