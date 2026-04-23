import type { Paginated } from "@/types/common";
import type { Dut, DutFilters, DutInput, InterfaceTestResult } from "@/types/dut";

import { apiClient } from "../api/client";

export const dutService = {
  async list(filters: DutFilters = {}): Promise<Paginated<Dut>> {
    const { data } = await apiClient.get("/dut/", { params: filters });
    return data;
  },
  async get(id: string): Promise<Dut> {
    const { data } = await apiClient.get(`/dut/${id}/`);
    return data;
  },
  async create(input: DutInput): Promise<Dut> {
    const { data } = await apiClient.post("/dut/", input);
    return data;
  },
  async update(id: string, input: Partial<DutInput>): Promise<Dut> {
    const { data } = await apiClient.patch(`/dut/${id}/`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/dut/${id}/`);
  },
  async testInterface(id: string, interfaces: string[]): Promise<InterfaceTestResult> {
    const { data } = await apiClient.post(`/dut/${id}/test-interface/`, { interfaces });
    return data;
  },
  async healthcheckAll(): Promise<{ ok: boolean }> {
    const { data } = await apiClient.post("/dut/healthcheck-all/");
    return data;
  },
};
