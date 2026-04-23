"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { DataQualityBaseline, DataQualityBaselineInput } from "@/types/dataQuality";
import { DEFAULT_BASELINE_INPUT } from "@/types/dataQuality";

import { BaselineFields } from "./BaselineFields";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dutName: string;
  baseline: DataQualityBaseline | null;
  isSaving: boolean;
  onSubmit: (input: DataQualityBaselineInput) => Promise<void>;
};

export function BaselineEditorDialog({ open, onOpenChange, dutName, baseline, isSaving, onSubmit }: Props) {
  const [form, setForm] = useState<DataQualityBaselineInput>(DEFAULT_BASELINE_INPUT);

  useEffect(() => {
    if (!open) return;
    if (baseline) {
      setForm({
        test_category: baseline.test_category,
        supported_ai_cases: baseline.supported_ai_cases,
        test_scenarios: baseline.test_scenarios,
        timeliness_max_lag_sec: baseline.timeliness_max_lag_sec,
        min_completeness: baseline.min_completeness,
        min_accuracy: baseline.min_accuracy,
        notes: baseline.notes,
      });
    } else {
      setForm(DEFAULT_BASELINE_INPUT);
    }
  }, [open, baseline]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{baseline ? "編輯" : "設定"} Baseline - {dutName}</DialogTitle>
        </DialogHeader>
        <BaselineFields value={form} onChange={setForm} />
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            取消
          </Button>
          <Button onClick={() => onSubmit(form)} disabled={isSaving}>
            {isSaving ? "儲存中…" : "儲存"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
