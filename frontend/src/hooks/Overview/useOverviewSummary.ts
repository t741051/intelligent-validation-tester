"use client";
import { useQuery } from "@tanstack/react-query";

import { overviewService } from "@/services";

export function useOverviewSummary() {
  return useQuery({
    queryKey: ["overview", "summary"],
    queryFn: () => overviewService.summary(),
    refetchInterval: 60_000,
  });
}
