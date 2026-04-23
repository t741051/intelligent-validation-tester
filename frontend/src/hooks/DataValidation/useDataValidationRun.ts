"use client";
import { useMutation } from "@tanstack/react-query";

import { dataQualityService } from "@/services";
import type { DataValidationResult } from "@/types/dataQuality";

export function useDataValidationRun() {
  const mutation = useMutation<DataValidationResult, Error, string>({
    mutationFn: (dutId: string) => dataQualityService.runValidation(dutId),
  });
  return {
    run: mutation.mutateAsync,
    result: mutation.data ?? null,
    isRunning: mutation.isPending,
    reset: mutation.reset,
  };
}
