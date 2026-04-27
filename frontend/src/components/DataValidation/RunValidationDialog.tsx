"use client";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { DataQualityBaseline } from "@/types/dataQuality";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dutName: string;
  baseline: DataQualityBaseline;
  isRunning: boolean;
  onRun: (scenarioId: string) => Promise<void>;
};

export function RunValidationDialog({
  open, onOpenChange, dutName, baseline, isRunning, onRun,
}: Props) {
  const scenarios = baseline.test_scenarios_detail;
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (open) setSelected(scenarios[0]?.id ?? null);
  }, [open, scenarios]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>執行驗證 - {dutName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-white/70">
            請選擇要針對哪份測試情境(資料集)執行驗證:
          </p>
          {scenarios.length === 0 ? (
            <p className="text-sm text-warning">
              此 baseline 尚未關聯任何測試情境 — 請先在「編輯 baseline」把情境加進來,才能執行驗證。
            </p>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-2 border border-white/10 rounded-item p-2">
              {scenarios.map((s) => {
                const active = selected === s.id;
                return (
                  <label
                    key={s.id}
                    className={`flex items-center gap-3 p-2 rounded-item cursor-pointer transition-colors ${
                      active ? "bg-mint-300/10 border border-mint-300/40" : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <input
                      type="radio"
                      name="scenario"
                      className="accent-mint-300"
                      checked={active}
                      onChange={() => setSelected(s.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{s.name}</div>
                      <div className="flex gap-2 mt-1">
                        {s.category && <Badge tone="gray">{s.category}</Badge>}
                        {s.ai_case && <Badge tone="gray">{s.ai_case}</Badge>}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRunning}>
            取消
          </Button>
          <Button
            onClick={() => selected && onRun(selected)}
            disabled={isRunning || !selected}
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? "驗證中…" : "執行"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
