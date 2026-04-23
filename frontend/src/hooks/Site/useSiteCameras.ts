"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { sitesService } from "@/services";
import type { SiteCameraInput } from "@/types/site";

export function useSiteCameras(siteId: string) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["site-cameras", siteId],
    queryFn: () => sitesService.listCameras(siteId),
  });
  const create = useMutation({
    mutationFn: (input: SiteCameraInput) => sitesService.createCamera(siteId, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-cameras", siteId] }),
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<SiteCameraInput> }) =>
      sitesService.updateCamera(siteId, id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-cameras", siteId] }),
  });
  const remove = useMutation({
    mutationFn: (cameraId: string) => sitesService.deleteCamera(siteId, cameraId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-cameras", siteId] }),
  });
  return {
    cameras: query.data ?? [],
    isLoading: query.isLoading,
    create: create.mutateAsync,
    isCreating: create.isPending,
    update: update.mutateAsync,
    isUpdating: update.isPending,
    remove: remove.mutateAsync,
  };
}
