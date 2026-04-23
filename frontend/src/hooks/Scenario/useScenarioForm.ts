"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { scenarioService } from "@/services";
import type { TestScenario, TestScenarioInput } from "@/types/scenario";

export function useScenarioForm() {
  const qc = useQueryClient();
  const create = useMutation<TestScenario, Error, TestScenarioInput>({
    mutationFn: (input) => scenarioService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scenario"] }),
  });
  const remove = useMutation<void, Error, string>({
    mutationFn: (id) => scenarioService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scenario"] }),
  });
  return {
    create: create.mutateAsync,
    isCreating: create.isPending,
    remove: remove.mutateAsync,
    isRemoving: remove.isPending,
  };
}
