import type { PlatformType } from "./common";

export type PlatformStatus = "pending" | "running" | "passed" | "failed";

export type Platform = {
  id: string;
  name: string;
  type: PlatformType;
  vendor: string;
  version: string;
  category: string;
  ai_cases: string[];
  endpoint: string;
  submitted_by: string;
  submit_date: string;
  status: PlatformStatus;
};

export type PlatformInput = Omit<Platform, "id" | "submitted_by" | "submit_date" | "status">;
