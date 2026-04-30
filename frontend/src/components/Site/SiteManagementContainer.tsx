"use client";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { useSites } from "@/hooks/Site/useSites";
import { useEditModeStore, useIsEditing } from "@/stores/editModeStore";
import { useIsWallMode } from "@/stores/wallModeStore";
import type { Region } from "@/types/common";

import { EditModeToggle } from "./EditModeToggle";
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
  const isEditing = useIsEditing();
  const isWall = useIsWallMode();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Reset to view mode on mount/unmount so edit state never bleeds to other pages.
  useEffect(() => {
    useEditModeStore.getState().setEditing(false);
    return () => useEditModeStore.getState().setEditing(false);
  }, []);

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
      {/* 電視牆模式下不渲染 PageHeader — 標題已在 app header bar,
          檢視/編輯切換移到 SiteDetail 頂端的場域資訊 bar,可省下垂直空間。 */}
      {!isWall && (
        <PageHeader title={TITLE[region] ?? "場域管理"}>
          <EditModeToggle />
        </PageHeader>
      )}
      {isLoading ? (
        <div className="text-white/40">載入中…</div>
      ) : (
        <div className="site-mgmt-grid grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4">
          <div className="space-y-3">
            {isEditing && <SiteCreateForm region={region} />}
            <SiteList
              sites={sites}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <div>
            {selected ? (
              <SiteDetail site={selected} />
            ) : (
              <div className="text-center text-white/40 py-12 border border-dashed rounded-item space-y-4">
                {isWall && (
                  <div className="flex justify-center">
                    <EditModeToggle />
                  </div>
                )}
                <div>左側選擇場域以檢視詳情</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
