"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dutService } from "@/services";

export function useDutHealthcheck() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => dutService.healthcheckAll(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dut"] }),
  });
  return {
    refreshAll: mutation.mutateAsync,
    isRefreshing: mutation.isPending,
  };
}
