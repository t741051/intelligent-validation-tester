import type { Paginated } from "@/types/common";
import type { ScenarioFilters, TestScenario, TestScenarioInput } from "@/types/scenario";

import { apiClient } from "../api/client";

export const scenarioService = {
  async list(filters: ScenarioFilters = {}): Promise<Paginated<TestScenario>> {
    const { data } = await apiClient.get("/scenarios/", { params: filters });
    return data;
  },
  async get(id: string): Promise<TestScenario> {
    const { data } = await apiClient.get(`/scenarios/${id}/`);
    return data;
  },
  async create(input: TestScenarioInput): Promise<TestScenario> {
    const { data } = await apiClient.post("/scenarios/", input);
    return data;
  },
  async update(id: string, input: Partial<TestScenarioInput>): Promise<TestScenario> {
    const { data } = await apiClient.patch(`/scenarios/${id}/`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/scenarios/${id}/`);
  },
};
