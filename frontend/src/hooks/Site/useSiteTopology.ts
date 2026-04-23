"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { sitesService } from "@/services";
import type { BaseStationInput, TopologyLinkInput } from "@/types/site";

export function useSiteTopology(siteId: string | null) {
  return useQuery({
    queryKey: ["site", siteId, "topology"],
    queryFn: () => sitesService.getTopology(siteId as string),
    enabled: !!siteId,
  });
}

export function useCreateStation(siteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BaseStationInput) =>
      sitesService.createStation(siteId, input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["site", siteId, "topology"] }),
  });
}

export function useDeleteStation(siteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => sitesService.deleteStation(siteId, code),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["site", siteId, "topology"] }),
  });
}

export function useUpdateStation(siteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, input }: { code: string; input: Partial<BaseStationInput> }) =>
      sitesService.updateStation(siteId, code, input),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["site", siteId, "topology"] }),
  });
}

export function useUpdateTopology(siteId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (links: TopologyLinkInput[]) =>
      sitesService.updateTopology(siteId, links),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["site", siteId, "topology"] }),
  });
}
