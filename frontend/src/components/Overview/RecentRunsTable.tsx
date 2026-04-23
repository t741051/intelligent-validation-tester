import { StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatScore } from "@/lib/formatters";
import type { OverviewSummary } from "@/types/overview";

export function RecentRunsTable({ runs }: { runs: OverviewSummary["recent_runs"] }) {
  return (
    <Card>
      <CardHeader><CardTitle>最近驗證結果</CardTitle></CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">目標類型</th>
              <th className="py-2">狀態</th>
              <th className="py-2">分數</th>
              <th className="py-2">開始時間</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2">{r.target_type}</td>
                <td className="py-2"><StatusBadge status={r.status} /></td>
                <td className="py-2">{formatScore(r.score)}</td>
                <td className="py-2 text-gray-500">{formatDate(r.started_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
