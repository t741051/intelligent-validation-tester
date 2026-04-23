"use client";
import { useQuery } from "@tanstack/react-query";

import { scenarioService } from "@/services";

export function useScenarioDetail(id: string | null) {
  const query = useQuery({
    queryKey: ["scenario", "detail", id],
    queryFn: () => scenarioService.get(id as string),
    enabled: !!id,
  });
  return {
    scenario: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
