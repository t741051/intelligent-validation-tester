import type {
  DataQualityBaseline,
  DataQualityBaselineInput,
  DataValidationResult,
} from "@/types/dataQuality";

import { baselineStore } from "./mockStore";

export const mockDataQualityService = {
  async getBaseline(dutId: string): Promise<DataQualityBaseline | null> {
    await new Promise((r) => setTimeout(r, 120));
    return baselineStore.get(dutId) ?? null;
  },
  async upsertBaseline(
    dutId: string,
    input: DataQualityBaselineInput,
  ): Promise<DataQualityBaseline> {
    await new Promise((r) => setTimeout(r, 150));
    const baseline: DataQualityBaseline = {
      dut: dutId,
      test_category: input.test_category,
      supported_ai_cases: input.supported_ai_cases,
      test_scenarios: input.test_scenarios,
      test_scenarios_detail: [],
      timeliness_max_lag_sec: input.timeliness_max_lag_sec,
      min_completeness: input.min_completeness,
      min_accuracy: input.min_accuracy,
      notes: input.notes ?? "",
      updated_at: new Date().toISOString(),
    };
    baselineStore.set(dutId, baseline);
    return baseline;
  },
  async runValidation(dutId: string): Promise<DataValidationResult> {
    await new Promise((r) => setTimeout(r, 800));
    const baseline = baselineStore.get(dutId);
    if (!baseline) throw new Error("Baseline not configured for this DUT.");
    const completeness = Math.round((80 + Math.random() * 19) * 100) / 100;
    const accuracy = Math.round((80 + Math.random() * 19) * 100) / 100;
    const timelinessLag = Math.round((10 + Math.random() * 110) * 10) / 10;
    const timelinessOk = timelinessLag <= baseline.timeliness_max_lag_sec;
    const overall =
      Math.round(((completeness + accuracy + (timelinessOk ? 100 : 60)) / 3) * 100) / 100;
    const passed =
      completeness >= baseline.min_completeness &&
      accuracy >= baseline.min_accuracy &&
      timelinessOk;
    return {
      dut_id: dutId,
      passed,
      score: overall,
      metrics: {
        completeness,
        accuracy,
        timeliness_lag_sec: timelinessLag,
        timeliness_ok: timelinessOk,
      },
      thresholds: {
        min_completeness: baseline.min_completeness,
        min_accuracy: baseline.min_accuracy,
        timeliness_max_lag_sec: baseline.timeliness_max_lag_sec,
      },
    };
  },
};
