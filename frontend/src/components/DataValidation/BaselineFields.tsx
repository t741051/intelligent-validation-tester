"use client";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { scenarioService } from "@/services";
import type { DataQualityBaselineInput, TestCategory } from "@/types/dataQuality";
import { AI_CASE_OPTIONS, TEST_CATEGORY_LABEL } from "@/types/dataQuality";

type Props = {
  value: DataQualityBaselineInput;
  onChange: (next: DataQualityBaselineInput) => void;
  showThresholds?: boolean;
};

export function BaselineFields({ value, onChange, showThresholds = true }: Props) {
  const { data: scenariosData, isLoading: scenariosLoading } = useQuery({
    queryKey: ["scenarios", "data-validation"],
    queryFn: () => scenarioService.list({ validation_type: "data-validation" }),
  });
  const scenarios = scenariosData?.items ?? [];

  const toggleAiCase = (c: string) => {
    const set = new Set(value.supported_ai_cases);
    if (set.has(c)) set.delete(c);
    else set.add(c);
    onChange({ ...value, supported_ai_cases: Array.from(set) });
  };

  const toggleScenario = (id: string) => {
    const set = new Set(value.test_scenarios);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange({ ...value, test_scenarios: Array.from(set) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">測試類別</label>
        <select
          className="flex h-9 w-full rounded-item border border-white/20 bg-navy-400 text-white px-3 py-1 text-sm"
          value={value.test_category}
          onChange={(e) =>
            onChange({ ...value, test_category: e.target.value as TestCategory | "" })
          }
        >
          <option value="">-- 未指定 --</option>
          {(Object.keys(TEST_CATEGORY_LABEL) as TestCategory[]).map((c) => (
            <option key={c} value={c}>{TEST_CATEGORY_LABEL[c]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">支援的 AI Cases</label>
        <div className="flex flex-wrap gap-2">
          {AI_CASE_OPTIONS.map((c) => {
            const active = value.supported_ai_cases.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleAiCase(c)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  active
                    ? "bg-mint-300 text-navy border-mint-300"
                    : "bg-white/5 text-white/80 border-white/20 hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">測試情境</label>
        {scenariosLoading ? (
          <div className="text-sm text-white/40">載入中…</div>
        ) : scenarios.length === 0 ? (
          <p className="text-sm text-white/40">尚無可用的資料驗證情境</p>
        ) : (
          <div className="space-y-1 max-h-40 overflow-y-auto border rounded-item p-2">
            {scenarios.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm py-1">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20"
                  checked={value.test_scenarios.includes(s.id)}
                  onChange={() => toggleScenario(s.id)}
                />
                <span>{s.name}</span>
                <Badge tone="gray">{s.category}</Badge>
                {s.ai_case && <Badge tone="gray">{s.ai_case}</Badge>}
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {showThresholds && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">完整性門檻 (%)</label>
              <Input
                type="number" min={0} max={100} step="0.1"
                value={value.min_completeness}
                onChange={(e) => onChange({ ...value, min_completeness: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">準確性門檻 (%)</label>
              <Input
                type="number" min={0} max={100} step="0.1"
                value={value.min_accuracy}
                onChange={(e) => onChange({ ...value, min_accuracy: Number(e.target.value) })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">即時性上限(秒)</label>
              <Input
                type="number" min={0}
                value={value.timeliness_max_lag_sec}
                onChange={(e) =>
                  onChange({ ...value, timeliness_max_lag_sec: Number(e.target.value) })
                }
              />
            </div>
          </>
        )}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">備註</label>
          <Input
            value={value.notes ?? ""}
            onChange={(e) => onChange({ ...value, notes: e.target.value })}
            placeholder="場域驗收基準"
          />
        </div>
      </div>
    </div>
  );
}
