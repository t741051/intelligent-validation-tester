import type {
  DataQualityBaseline,
  DataQualityBaselineInput,
  DataValidationResult,
} from "@/types/dataQuality";

import { apiClient } from "../api/client";

export const dataQualityService = {
  async getBaseline(dutId: string): Promise<DataQualityBaseline | null> {
    try {
      const { data } = await apiClient.get(`/dut/${dutId}/baseline/`);
      return data;
    } catch (err: unknown) {
      if ((err as { response?: { status?: number } })?.response?.status === 404) return null;
      throw err;
    }
  },
  async upsertBaseline(dutId: string, input: DataQualityBaselineInput): Promise<DataQualityBaseline> {
    const { data } = await apiClient.put(`/dut/${dutId}/baseline/`, input);
    return data;
  },
  async runValidation(dutId: string): Promise<DataValidationResult> {
    const { data } = await apiClient.post(`/dut/${dutId}/run-data-validation/`);
    return data;
  },
};
