import type { DutType, Interface } from "./common";
import type { Environment } from "./site";

export type DutStatus = "online" | "offline" | "error";

export const DEFAULT_INTERFACES: Record<DutType, Interface[]> = {
  SMO: ["O1", "A1"],
  RIC: ["A1", "E2"],
  xApp: ["E2"],
  rApp: ["A1", "O1"],
};

export const AVAILABLE_INTERFACES: Record<DutType, Interface[]> = {
  SMO: ["O1", "A1"],
  RIC: ["A1", "E2", "O1"],
  xApp: ["E2"],
  rApp: ["A1", "O1"],
};

export type Dut = {
  id: string;
  site: string;
  site_name?: string;
  site_environment?: Environment;
  name: string;
  type: DutType;
  endpoint: string;
  interfaces: Interface[];
  status: DutStatus;
  response_time_ms: number | null;
  data_format: string;
  last_check: string | null;
  created_at: string;
};

export type DutInput = Omit<Dut,
  "id" | "site_name" | "site_environment" | "status" | "response_time_ms" | "data_format" | "last_check" | "created_at">;

export type DutFilters = {
  type?: DutType;
  status?: DutStatus;
  site?: string;
  has_baseline?: boolean;
  page?: number;
  limit?: number;
};

export type InterfaceTestResult = {
  dut_id: string;
  ok: boolean;
  results: Record<string, { ok: boolean; error: string | null }>;
};
