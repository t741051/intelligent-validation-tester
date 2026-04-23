"use client";
import { Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";
import type { Dut } from "@/types/dut";
import type { DataQualityBaseline } from "@/types/dataQuality";
import { TEST_CATEGORY_LABEL } from "@/types/dataQuality";

const ENV_LABEL: Record<string, string> = { indoor: "室內", outdoor: "室外" };

type Props = {
  dut: Dut;
  baseline: DataQualityBaseline | null;
  isLoading: boolean;
  onEdit: () => void;
};

export function BaselineCard({ dut, baseline, isLoading, onEdit }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{dut.name}</CardTitle>
            <p className="text-sm text-gray-500">
              {dut.type} · <span className="font-mono text-xs">{dut.endpoint}</span>
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Settings2 className="w-4 h-4 mr-2" />
            {baseline ? "編輯" : "設定"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-gray-400 text-sm">載入中…</div>
        ) : !baseline ? (
          <div className="text-sm text-orange-600">
            尚未設定 Baseline,無法執行資料品質驗證。
          </div>
        ) : (
          <div className="space-y-5">
            <section className="grid grid-cols-2 gap-4 text-sm">
              <Field label="部署場域">
                <div className="flex items-center gap-2">
                  <span>{dut.site_name ?? "-"}</span>
                  {dut.site_environment && (
                    <Badge tone="gray">
                      {ENV_LABEL[dut.site_environment] ?? dut.site_environment}
                    </Badge>
                  )}
                </div>
              </Field>
              <Field label="測試類別">
                {baseline.test_category ? (
                  <Badge tone="blue">{TEST_CATEGORY_LABEL[baseline.test_category]}</Badge>
                ) : (
                  <span className="text-gray-400">未指定</span>
                )}
              </Field>
            </section>

            <section>
              <div className="text-gray-600 text-sm mb-2">支援的 AI Cases</div>
              <div className="flex flex-wrap gap-1">
                {baseline.supported_ai_cases.length === 0 ? (
                  <span className="text-gray-400 text-sm">未指定</span>
                ) : (
                  baseline.supported_ai_cases.map((c) => (
                    <Badge key={c} tone="gray">{c}</Badge>
                  ))
                )}
              </div>
            </section>

            <section>
              <div className="text-gray-600 text-sm mb-2">測試情境</div>
              {baseline.test_scenarios_detail.length === 0 ? (
                <span className="text-gray-400 text-sm">尚未選擇</span>
              ) : (
                <ul className="space-y-1">
                  {baseline.test_scenarios_detail.map((s) => (
                    <li key={s.id} className="text-sm flex items-center gap-2">
                      <span>{s.name}</span>
                      <Badge tone="gray">{s.category}</Badge>
                      {s.ai_case && <Badge tone="gray">{s.ai_case}</Badge>}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="text-gray-600 text-sm mb-2">Baseline 門檻</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <Metric label="完整性" value={`${baseline.min_completeness}%`} />
                <Metric label="準確性" value={`${baseline.min_accuracy}%`} />
                <Metric label="即時性上限" value={`${baseline.timeliness_max_lag_sec}s`} />
              </div>
            </section>

            {baseline.notes && (
              <section>
                <div className="text-gray-600 text-sm mb-1">備註</div>
                <div className="text-sm text-gray-700">{baseline.notes}</div>
              </section>
            )}
            <div className="text-xs text-gray-400">
              最後更新:{formatDate(baseline.updated_at)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-gray-600">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-600">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
