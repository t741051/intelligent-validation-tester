export type TestCategory = "underground" | "ground-floor" | "high-floor";

export const TEST_CATEGORY_LABEL: Record<TestCategory, string> = {
  underground: "地下樓層",
  "ground-floor": "地面樓層",
  "high-floor": "高樓層",
};

export type ScenarioBrief = {
  id: string;
  name: string;
  category: string;
  ai_case: string;
};

export type DataQualityBaseline = {
  dut: string;
  test_category: TestCategory | "";
  supported_ai_cases: string[];
  test_scenarios: string[];
  test_scenarios_detail: ScenarioBrief[];
  timeliness_max_lag_sec: number;
  min_completeness: number;
  min_accuracy: number;
  notes: string;
  updated_at: string;
};

export type DataQualityBaselineInput = {
  test_category: TestCategory | "";
  supported_ai_cases: string[];
  test_scenarios: string[];
  timeliness_max_lag_sec: number;
  min_completeness: number;
  min_accuracy: number;
  notes?: string;
};

export const DEFAULT_BASELINE_INPUT: DataQualityBaselineInput = {
  test_category: "",
  supported_ai_cases: [],
  test_scenarios: [],
  timeliness_max_lag_sec: 60,
  min_completeness: 90,
  min_accuracy: 85,
  notes: "",
};

export const AI_CASE_OPTIONS = ["CCO", "ES", "Load Balance", "QoE"] as const;

export type DataValidationResult = {
  dut_id: string;
  scenario: {
    id: string;
    name: string;
    category: string;
    ai_case: string;
  };
  passed: boolean;
  score: number;
  metrics: {
    completeness: number;
    accuracy: number;
    timeliness_lag_sec: number;
    timeliness_ok: boolean;
  };
  thresholds: {
    min_completeness: number;
    min_accuracy: number;
    timeliness_max_lag_sec: number;
  };
};
