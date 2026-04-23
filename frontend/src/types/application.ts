import type { AppType } from "./common";

export type Application = {
  id: string;
  name: string;
  type: AppType;
  platform_type: string;
  ai_case: string;
  category: string;
  vendor: string;
  version: string;
  endpoint: string;
  intelligence_score: number | null;
  submitted_by: string;
  created_at: string;
};

export type ApplicationInput = Omit<Application,
  "id" | "submitted_by" | "intelligence_score" | "created_at">;
