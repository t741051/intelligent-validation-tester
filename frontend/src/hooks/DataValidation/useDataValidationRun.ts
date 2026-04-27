"use client";
import { useMutation } from "@tanstack/react-query";

import { dataQualityService } from "@/services";
import type { DataValidationResult } from "@/types/dataQuality";

type RunArgs = { dutId: string; scenarioId: string };

export function useDataValidationRun() {
  const mutation = useMutation<DataValidationResult, Error, RunArgs>({
    mutationFn: ({ dutId, scenarioId }) =>
      dataQualityService.runValidation(dutId, scenarioId),
  });
  return {
    run: mutation.mutateAsync,
    result: mutation.data ?? null,
    isRunning: mutation.isPending,
    reset: mutation.reset,
  };
}
