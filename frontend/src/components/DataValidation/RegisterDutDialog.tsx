"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDutList } from "@/hooks/Dut/useDutList";
import type { DutType } from "@/types/common";
import type { DataQualityBaselineInput } from "@/types/dataQuality";
import { DEFAULT_BASELINE_INPUT } from "@/types/dataQuality";

import { BaselineFields } from "./BaselineFields";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dutType: DutType;
  isSubmitting: boolean;
  onSubmit: (dutId: string, input: DataQualityBaselineInput) => Promise<void>;
};

export function RegisterDutDialog({ open, onOpenChange, dutType, isSubmitting, onSubmit }: Props) {
  const { duts, isLoading } = useDutList({ type: dutType, has_baseline: false });
  const [dutId, setDutId] = useState<string>("");
  const [form, setForm] = useState<DataQualityBaselineInput>(DEFAULT_BASELINE_INPUT);

  useEffect(() => {
    if (open) {
      setDutId("");
      setForm(DEFAULT_BASELINE_INPUT);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加 {dutType} 至資料品質驗證</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">選擇 DUT</label>
            {isLoading ? (
              <div className="text-sm text-white/40">載入中…</div>
            ) : duts.length === 0 ? (
              <p className="text-sm text-warning">
                沒有可用的 {dutType} DUT(全部已註冊或尚未於「連接介面驗證」建立)。
              </p>
            ) : (
              <select
                className="flex h-9 w-full rounded-item border border-white/20 bg-navy-400 text-white px-3 py-1 text-sm"
                value={dutId}
                onChange={(e) => setDutId(e.target.value)}
              >
                <option value="">-- 請選擇 --</option>
                {duts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} · {d.endpoint}
                  </option>
                ))}
              </select>
            )}
          </div>
          <BaselineFields value={form} onChange={setForm} showThresholds={false} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            取消
          </Button>
          <Button
            onClick={() => dutId && onSubmit(dutId, form)}
            disabled={isSubmitting || !dutId}
          >
            {isSubmitting ? "註冊中…" : "註冊"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
