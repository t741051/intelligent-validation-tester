"use client";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { useSites } from "@/hooks/Site/useSites";
import type { Region } from "@/types/common";

import { SiteCreateForm } from "./SiteCreateForm";
import { SiteDetail } from "./SiteDetail";
import { SiteList } from "./SiteList";

const TITLE: Record<string, string> = {
  domestic: "國內場域",
  international: "國外場域",
};

export function SiteManagementContainer({ region }: { region: Region }) {
  const { data, isLoading } = useSites(region);
  const sites = data?.items ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId && sites.length > 0) {
      setSelectedId(sites[0].id);
    }
    if (selectedId && !sites.some((s) => s.id === selectedId)) {
      setSelectedId(sites[0]?.id ?? null);
    }
  }, [sites, selectedId]);

  const selected = sites.find((s) => s.id === selectedId) ?? null;

  return (
    <>
      <PageHeader title={TITLE[region] ?? "場域管理"}>
        <SiteCreateForm region={region} />
      </PageHeader>
      {isLoading ? (
        <div className="text-gray-400">載入中…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          <SiteList
            sites={sites}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div>
            {selected ? (
              <SiteDetail site={selected} />
            ) : (
              <div className="text-center text-gray-400 py-12 border border-dashed rounded-lg">
                左側選擇場域以檢視詳情
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
