import type { Paginated } from "@/types/common";
import type { ValidationRun } from "@/types/validationRun";

import { apiClient } from "../api/client";

type ListParams = {
  scenario?: string;
  status?: string;
  target_type?: string;
  target_id?: string;
};

export const validationRunService = {
  async list(params: ListParams = {}): Promise<Paginated<ValidationRun>> {
    const { data } = await apiClient.get("/validation-runs/", { params });
    return data;
  },
  async get(id: string): Promise<ValidationRun> {
    const { data } = await apiClient.get(`/validation-runs/${id}/`);
    return data;
  },
};
