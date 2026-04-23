"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dutService } from "@/services";

export function useDutInterfaceTest() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, interfaces }: { id: string; interfaces: string[] }) =>
      dutService.testInterface(id, interfaces),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dut"] }),
  });
  return {
    testInterface: mutation.mutateAsync,
    isTesting: mutation.isPending,
    result: mutation.data,
  };
}
