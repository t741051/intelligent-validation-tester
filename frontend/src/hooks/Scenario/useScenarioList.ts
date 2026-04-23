"use client";
import { useQuery } from "@tanstack/react-query";

import { scenarioService } from "@/services";
import type { ScenarioFilters } from "@/types/scenario";

export function useScenarioList(filters: ScenarioFilters = {}) {
  const query = useQuery({
    queryKey: ["scenario", "list", filters],
    queryFn: () => scenarioService.list(filters),
  });
  return {
    scenarios: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    refresh: query.refetch,
  };
}
