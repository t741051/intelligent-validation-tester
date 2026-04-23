import type { OverviewSummary } from "@/types/overview";

import { apiClient } from "../api/client";

export const overviewService = {
  async summary(): Promise<OverviewSummary> {
    const { data } = await apiClient.get("/overview/summary/");
    return data;
  },
};
