"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dutService } from "@/services";
import type { DutInput } from "@/types/dut";

export function useDutForm() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: (input: DutInput) => dutService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dut"] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => dutService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dut"] }),
  });
  return {
    create: create.mutateAsync,
    isCreating: create.isPending,
    remove: remove.mutateAsync,
    isRemoving: remove.isPending,
  };
}
