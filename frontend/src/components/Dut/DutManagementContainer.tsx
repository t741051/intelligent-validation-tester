"use client";
import { Plus, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useDutForm } from "@/hooks/Dut/useDutForm";
import { useDutHealthcheck } from "@/hooks/Dut/useDutHealthcheck";
import { useDutInterfaceTest } from "@/hooks/Dut/useDutInterfaceTest";
import { useDutList } from "@/hooks/Dut/useDutList";
import { useSites } from "@/hooks/Site/useSites";
import type { DutType } from "@/types/common";
import type { Dut, InterfaceTestResult } from "@/types/dut";

import { DutDetailCard } from "./DutDetailCard";
import { DutFormDialog } from "./DutFormDialog";
import { DutList } from "./DutList";
import { DutTypeBanner } from "./DutTypeBanner";
import { RunInterfaceTestDialog } from "./RunInterfaceTestDialog";

export function DutManagementContainer({ dutType }: { dutType: DutType }) {
  const { duts, isLoading, refresh } = useDutList({ type: dutType });
  const { create, isCreating } = useDutForm();
  const { testInterface, isTesting } = useDutInterfaceTest();
  const { refreshAll, isRefreshing } = useDutHealthcheck();
  const { data: sitesData } = useSites();
  const sites = sitesData?.items ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Dut | null>(null);
  const [testResult, setTestResult] = useState<InterfaceTestResult | null>(null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const refreshOne = async (d: Dut) => {
    setRefreshingId(d.id);
    try {
      await testInterface({ id: d.id, interfaces: d.interfaces });
      await refresh();
    } finally {
      setRefreshingId(null);
    }
  };

  useEffect(() => {
    setSelected(null);
    setTestResult(null);
  }, [dutType]);

  useEffect(() => {
    if (selected) {
      const refreshed = duts.find((d) => d.id === selected.id);
      if (refreshed && refreshed !== selected) setSelected(refreshed);
    }
  }, [duts, selected]);

  const runTest = async () => {
    if (!selected) return;
    const result = await testInterface({
      id: selected.id,
      interfaces: selected.interfaces,
    });
    setTestResult(result);
    setTestDialogOpen(false);
    await refresh();
  };

  return (
    <>
      <PageHeader title={`連接介面驗證 - ${dutType}`}>
        <Button
          variant="outline"
          onClick={async () => {
            await refreshAll();
            await refresh();
          }}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "檢查中..." : "刷新狀態"}
        </Button>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> 新增 DUT
        </Button>
      </PageHeader>
      <p className="-mt-3 mb-4 text-sm text-white/70">
        檢查所有 {dutType} 設備的接口介面是否正常運作
      </p>

      <div className="space-y-4">
        <DutTypeBanner dutType={dutType} />

        <DutList
          duts={duts}
          isLoading={isLoading}
          selectedId={selected?.id ?? null}
          onSelect={(d) => {
            setSelected(d);
            setTestResult(null);
          }}
          onRefresh={refreshOne}
          refreshingId={refreshingId}
        />

        {selected && (
          <DutDetailCard
            dut={selected}
            testResult={testResult}
            onRunTest={() => setTestDialogOpen(true)}
          />
        )}
      </div>

      <DutFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        dutType={dutType}
        sites={sites}
        isSubmitting={isCreating}
        onSubmit={async (input) => {
          await create(input);
          await refresh();
          setFormOpen(false);
        }}
      />
      <RunInterfaceTestDialog
        open={testDialogOpen}
        onOpenChange={setTestDialogOpen}
        dut={selected}
        isRunning={isTesting}
        onRun={runTest}
      />
    </>
  );
}
