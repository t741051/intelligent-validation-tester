import type { OverviewSummary } from "@/types/overview";

export const mockOverviewService = {
  async summary(): Promise<OverviewSummary> {
    await new Promise((r) => setTimeout(r, 200));
    return {
      kpis: {
        smo_pass_rate: 0.92,
        ric_pass_rate: 0.88,
        intelligence_avg_score: 85.3,
        running_tests: 3,
      },
      distribution: {
        data_validation: { passed: 156, total: 180 },
        intelligence_validation: { passed: 89, total: 120 },
      },
      platform_status: {
        smo: { passed: 23, total: 25 },
        ric: { passed: 18, total: 22 },
      },
      recent_runs: [
        { id: "r1", target_type: "platform", target_id: "p1",
          status: "passed", score: 92, started_at: new Date().toISOString() },
        { id: "r2", target_type: "application", target_id: "a1",
          status: "running", score: null, started_at: new Date().toISOString() },
      ],
    };
  },
};
