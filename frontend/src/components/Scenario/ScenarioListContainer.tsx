"use client";
import { Plus } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useScenarioForm } from "@/hooks/Scenario/useScenarioForm";
import { useScenarioList } from "@/hooks/Scenario/useScenarioList";
import type { ScenarioFilters as Filters, TestScenario } from "@/types/scenario";

import { ScenarioFilters } from "./ScenarioFilters";
import { ScenarioFormDialog } from "./ScenarioFormDialog";
import { ScenarioList } from "./ScenarioList";

export function ScenarioListContainer() {
  const [filters, setFilters] = useState<Filters>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TestScenario | null>(null);

  const { scenarios, isLoading, refresh } = useScenarioList(filters);
  const { create, isCreating, update, isUpdating, remove } = useScenarioForm();

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (s: TestScenario) => { setEditing(s); setFormOpen(true); };

  return (
    <>
      <PageHeader title="端對端測試情境">
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> 新增情境
        </Button>
      </PageHeader>
      <p className="-mt-3 mb-4 text-sm text-white/70">
        管理各場域收上來的資料情境,可依場域、類別、驗證類型篩選
      </p>
      <div className="space-y-4">
        <ScenarioFilters value={filters} onChange={setFilters} />
        <ScenarioList
          scenarios={scenarios}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={async (id) => {
            if (!confirm("確定刪除這個情境?")) return;
            await remove(id);
          }}
        />
      </div>
      <ScenarioFormDialog
        open={formOpen}
        onOpenChange={(v) => { setFormOpen(v); if (!v) setEditing(null); }}
        existing={editing}
        isSubmitting={isCreating || isUpdating}
        onSubmit={async (input) => {
          if (editing) {
            await update({ id: editing.id, input });
          } else {
            await create(input);
          }
          await refresh();
          setFormOpen(false);
          setEditing(null);
        }}
      />
    </>
  );
}
