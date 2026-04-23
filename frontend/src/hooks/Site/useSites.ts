"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { sitesService } from "@/services";
import type { Region } from "@/types/common";
import type { SiteInput } from "@/types/site";

export function useSites(region?: Region) {
  return useQuery({
    queryKey: ["sites", { region }],
    queryFn: () => sitesService.list({ region }),
  });
}

export function useCreateSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SiteInput) => sitesService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sites"] }),
  });
}

export function useUpdateSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<SiteInput> }) =>
      sitesService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sites"] }),
  });
}

export function useDeleteSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sitesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sites"] }),
  });
}
