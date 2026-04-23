export type OverviewSummary = {
  kpis: {
    smo_pass_rate: number;
    ric_pass_rate: number;
    intelligence_avg_score: number;
    running_tests: number;
  };
  distribution: {
    data_validation: { passed: number; total: number };
    intelligence_validation: { passed: number; total: number };
  };
  platform_status: {
    smo: { passed: number; total: number };
    ric: { passed: number; total: number };
  };
  recent_runs: Array<{
    id: string;
    target_type: string;
    target_id: string;
    status: string;
    score: number | null;
    started_at: string;
  }>;
};
