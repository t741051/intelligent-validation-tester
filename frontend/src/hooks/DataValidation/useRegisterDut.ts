"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dataQualityService } from "@/services";
import type { DataQualityBaseline, DataQualityBaselineInput } from "@/types/dataQuality";

type RegisterInput = { dutId: string; input: DataQualityBaselineInput };

export function useRegisterDut() {
  const qc = useQueryClient();
  const mutation = useMutation<DataQualityBaseline, Error, RegisterInput>({
    mutationFn: ({ dutId, input }) => dataQualityService.upsertBaseline(dutId, input),
    onSuccess: (data) => {
      qc.setQueryData(["baseline", data.dut], data);
      qc.invalidateQueries({ queryKey: ["dut"] });
    },
  });
  return { register: mutation.mutateAsync, isRegistering: mutation.isPending };
}
