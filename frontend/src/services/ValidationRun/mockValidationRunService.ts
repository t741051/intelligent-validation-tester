import type { Paginated } from "@/types/common";
import type { ValidationRun } from "@/types/validationRun";

const seed: ValidationRun[] = [];

type ListParams = {
  scenario?: string;
  status?: string;
  target_type?: string;
  target_id?: string;
};

export const mockValidationRunService = {
  async list(params: ListParams = {}): Promise<Paginated<ValidationRun>> {
    await new Promise((r) => setTimeout(r, 100));
    let items = [...seed];
    if (params.scenario) items = items.filter((r) => r.scenario === params.scenario);
    if (params.status) items = items.filter((r) => r.status === params.status);
    return { items, total: items.length, page: 1, limit: 20 };
  },
  async get(id: string): Promise<ValidationRun> {
    const r = seed.find((x) => x.id === id);
    if (!r) throw new Error("Run not found");
    return r;
  },
};
