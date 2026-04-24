"use client";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";
import type { TestScenario } from "@/types/scenario";
import { SCENARIO_CATEGORY_LABEL, VALIDATION_TYPE_LABEL } from "@/types/scenario";

type Props = {
  scenarios: TestScenario[];
  isLoading: boolean;
  onDelete: (id: string) => void;
};

export function ScenarioList({ scenarios, isLoading, onDelete }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-white/40">載入中…</div>
        ) : scenarios.length === 0 ? (
          <div className="p-12 text-center text-white/40">尚未建立任何測試情境</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/60 bg-white/5 border-b">
                  <th className="px-4 py-3">情境名稱</th>
                  <th className="px-4 py-3">場域</th>
                  <th className="px-4 py-3">類別</th>
                  <th className="px-4 py-3">驗證類型</th>
                  <th className="px-4 py-3">來源 DUT</th>
                  <th className="px-4 py-3">AI Case</th>
                  <th className="px-4 py-3">收集時間</th>
                  <th className="px-4 py-3 text-right">資料筆數</th>
                  <th className="px-4 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-white/60 font-mono">{s.id.slice(0, 8)}</div>
                    </td>
                    <td className="px-4 py-3">{s.site_name ?? "-"}</td>
                    <td className="px-4 py-3">
                      <Badge tone="gray">{SCENARIO_CATEGORY_LABEL[s.category]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="blue">{VALIDATION_TYPE_LABEL[s.validation_type]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {s.source_dut_name ? (
                        <>
                          <div>{s.source_dut_name}</div>
                          {s.source_dut_type && (
                            <Badge tone="gray">{s.source_dut_type}</Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-white/40">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{s.ai_case || "-"}</td>
                    <td className="px-4 py-3 text-white/70 text-xs">
                      {formatDate(s.collected_at)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {s.row_count != null ? s.row_count.toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/test-scenarios/${s.id}`}>
                          <Button size="icon" variant="ghost" aria-label="檢視">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="icon" variant="ghost" aria-label="刪除"
                          onClick={() => onDelete(s.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
