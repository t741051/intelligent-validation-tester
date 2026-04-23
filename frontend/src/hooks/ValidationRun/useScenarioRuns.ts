"use client";
import { useQuery } from "@tanstack/react-query";

import { validationRunService } from "@/services";

export function useScenarioRuns(scenarioId: string | null) {
  const query = useQuery({
    queryKey: ["validation-runs", "by-scenario", scenarioId],
    queryFn: () => validationRunService.list({ scenario: scenarioId as string }),
    enabled: !!scenarioId,
  });
  return {
    runs: query.data?.items ?? [],
    isLoading: query.isLoading,
  };
}
