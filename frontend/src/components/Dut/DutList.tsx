"use client";
import { Eye, Pencil, RefreshCw } from "lucide-react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";
import type { Dut } from "@/types/dut";

const ENV_LABEL: Record<string, string> = { indoor: "室內", outdoor: "室外" };

type Props = {
  duts: Dut[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (dut: Dut) => void;
  onRefresh?: (dut: Dut) => void;
  refreshingId?: string | null;
};

function responseTimeClass(ms: number | null) {
  if (ms == null) return "text-white/40";
  if (ms > 1000) return "text-danger";
  if (ms > 200) return "text-warning";
  return "text-mint-300";
}

export function DutList({ duts, isLoading, selectedId, onSelect, onRefresh, refreshingId }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DUT 設備列表</CardTitle>
        <p className="text-sm text-white/60">所有待驗證的 DUT 設備及其連接狀態</p>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-white/40">載入中…</div>
        ) : duts.length === 0 ? (
          <div className="p-12 text-center text-white/40">尚未新增 DUT</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/60 bg-white/5 border-b">
                  <th className="px-4 py-3">設備資訊</th>
                  <th className="px-4 py-3">類型</th>
                  <th className="px-4 py-3">Endpoint</th>
                  <th className="px-4 py-3">部署場域</th>
                  <th className="px-4 py-3">狀態</th>
                  <th className="px-4 py-3">資料格式</th>
                  <th className="px-4 py-3">回應時間</th>
                  <th className="px-4 py-3">最後檢查</th>
                  <th className="px-4 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {duts.map((d) => {
                  const active = d.id === selectedId;
                  return (
                    <tr
                      key={d.id}
                      className={`border-b last:border-0 cursor-pointer ${
                        active ? "bg-mint-300/10" : "hover:bg-white/5"
                      }`}
                      onClick={() => onSelect(d)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{d.name}</div>
                        <div className="text-xs text-white/60 font-mono">{d.id.slice(0, 8)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone="gray">{d.type}</Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-white/70">{d.endpoint}</td>
                      <td className="px-4 py-3">
                        <div>{d.site_name ?? "-"}</div>
                        {d.site_environment && (
                          <Badge tone="gray">{ENV_LABEL[d.site_environment] ?? d.site_environment}</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                      <td className="px-4 py-3 text-white/70">{d.data_format || "-"}</td>
                      <td className={`px-4 py-3 text-sm ${responseTimeClass(d.response_time_ms)}`}>
                        {d.response_time_ms != null ? `${d.response_time_ms}ms` : "-"}
                      </td>
                      <td className="px-4 py-3 text-white/70 text-xs">{formatDate(d.last_check)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          {onRefresh && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); onRefresh(d); }}
                              disabled={refreshingId === d.id}
                              aria-label="刷新狀態"
                              title="刷新狀態"
                            >
                              <RefreshCw className={`w-4 h-4 ${refreshingId === d.id ? "animate-spin" : ""}`} />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); onSelect(d); }}
                            aria-label="檢視"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" disabled aria-label="編輯">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
