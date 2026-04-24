"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Dut } from "@/types/dut";

const ENV_LABEL: Record<string, string> = { indoor: "室內", outdoor: "室外" };

type Props = {
  duts: Dut[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (dut: Dut) => void;
};

export function DataValidationDutList({ duts, isLoading, selectedId, onSelect }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DUT 設備列表</CardTitle>
        <p className="text-sm text-white/60">選擇要驗證資料品質的設備</p>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-white/40">載入中…</div>
        ) : duts.length === 0 ? (
          <div className="p-12 text-center text-white/40">尚未新增此類型 DUT</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/60 bg-white/5 border-b">
                  <th className="px-4 py-3">設備</th>
                  <th className="px-4 py-3">Endpoint</th>
                  <th className="px-4 py-3">部署場域</th>
                  <th className="px-4 py-3">介面狀態</th>
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
                      <td className="px-4 py-3 font-mono text-xs text-white/70">{d.endpoint}</td>
                      <td className="px-4 py-3">
                        <div>{d.site_name ?? "-"}</div>
                        {d.site_environment && (
                          <Badge tone="gray">
                            {ENV_LABEL[d.site_environment] ?? d.site_environment}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
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
