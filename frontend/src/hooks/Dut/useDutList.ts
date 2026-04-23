"use client";
import { useQuery } from "@tanstack/react-query";

import { dutService } from "@/services";
import type { DutFilters } from "@/types/dut";

export function useDutList(filters: DutFilters = {}) {
  const query = useQuery({
    queryKey: ["dut", "list", filters],
    queryFn: () => dutService.list(filters),
  });
  return {
    duts: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    refresh: query.refetch,
  };
}
