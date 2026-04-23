"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { dataQualityService } from "@/services";
import type { DataQualityBaselineInput } from "@/types/dataQuality";

const baselineKey = (dutId: string) => ["baseline", dutId] as const;

export function useBaseline(dutId: string | null) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: baselineKey(dutId ?? ""),
    queryFn: () => dataQualityService.getBaseline(dutId as string),
    enabled: !!dutId,
  });

  const mutation = useMutation({
    mutationFn: (input: DataQualityBaselineInput) =>
      dataQualityService.upsertBaseline(dutId as string, input),
    onSuccess: (data) => {
      if (dutId) qc.setQueryData(baselineKey(dutId), data);
    },
  });

  return {
    baseline: query.data ?? null,
    isLoading: query.isLoading,
    save: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}
