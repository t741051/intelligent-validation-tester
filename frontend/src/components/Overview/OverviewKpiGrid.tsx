import { KpiCard } from "@/components/common/KpiCard";
import { formatPercent, formatScore } from "@/lib/formatters";
import type { OverviewSummary } from "@/types/overview";

export function OverviewKpiGrid({ kpis }: { kpis: OverviewSummary["kpis"] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard label="SMO 通過率" value={formatPercent(kpis.smo_pass_rate)} tone="blue" />
      <KpiCard label="RIC 通過率" value={formatPercent(kpis.ric_pass_rate)} tone="green" />
      <KpiCard label="智慧平均分" value={formatScore(kpis.intelligence_avg_score)} tone="purple" />
      <KpiCard label="進行中測試" value={String(kpis.running_tests)} tone="orange" />
    </div>
  );
}
