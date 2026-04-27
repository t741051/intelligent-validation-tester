"use client";
import { CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DataValidationResult } from "@/types/dataQuality";

export function ValidationResultCard({ result }: { result: DataValidationResult }) {
  const { scenario, metrics, thresholds, passed, score } = result;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>驗證結果</CardTitle>
            <p className="text-sm text-white/60">
              情境 <span className="text-white/80">{scenario.name}</span> · 整體分數 {score}
            </p>
          </div>
          <Badge tone={passed ? "green" : "red"}>
            {passed ? (
              <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 通過</>
            ) : (
              <><XCircle className="w-3.5 h-3.5 mr-1" /> 未通過</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <MetricRow
            label="完整性"
            value={`${metrics.completeness}%`}
            threshold={`≥ ${thresholds.min_completeness}%`}
            pass={metrics.completeness >= thresholds.min_completeness}
          />
          <MetricRow
            label="準確性"
            value={`${metrics.accuracy}%`}
            threshold={`≥ ${thresholds.min_accuracy}%`}
            pass={metrics.accuracy >= thresholds.min_accuracy}
          />
          <MetricRow
            label="即時性"
            value={`${metrics.timeliness_lag_sec}s`}
            threshold={`≤ ${thresholds.timeliness_max_lag_sec}s`}
            pass={metrics.timeliness_ok}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricRow({
  label, value, threshold, pass,
}: {
  label: string; value: string; threshold: string; pass: boolean;
}) {
  return (
    <div className={`p-3 rounded-item border ${pass ? "border-mint-300/30 bg-mint-300/10" : "border-danger/30 bg-danger/10"}`}>
      <div className="text-xs text-white/70">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      <div className="text-xs text-white/60 mt-1">門檻 {threshold}</div>
    </div>
  );
}
