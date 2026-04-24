"use client";
import { Settings2 } from "lucide-react";
import { useState } from "react";

import { CollapsibleCard } from "@/components/common/CollapsibleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteTopology } from "@/hooks/Site/useSiteTopology";
import { useIsEditing } from "@/stores/editModeStore";
import type { Site } from "@/types/site";

import { CameraList } from "./CameraList";
import { SiteSettingsDialog } from "./SiteSettingsDialog";
import { SiteLayoutCanvas } from "./SiteLayoutCanvas";
import { StationList } from "./StationList";
import { TopologyCanvas } from "./TopologyCanvas";
import { TopologyLinkEditor } from "./TopologyLinkEditor";

const ENV_LABEL: Record<string, string> = { indoor: "室內", outdoor: "室外" };

export function SiteDetail({ site }: { site: Site }) {
  const { data, isLoading } = useSiteTopology(site.id);
  const stations = data?.stations ?? [];
  const links = data?.links ?? [];
  const gnbStations = stations.filter((s) => s.node_type === "gnb");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isEditing = useIsEditing();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-lg font-semibold truncate">{site.name}</span>
            <Badge tone={site.environment === "outdoor" ? "blue" : "gray"}>
              {ENV_LABEL[site.environment] ?? site.environment}
            </Badge>
            {site.address && (
              <span className="text-sm text-white/60 truncate">{site.address}</span>
            )}
            <Badge tone={site.floor_plan_url ? "green" : "gray"}>
              {site.floor_plan_url ? "已設平面圖" : "網格底"}
            </Badge>
          </div>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
              <Settings2 className="w-4 h-4 mr-2" /> 場域設定
            </Button>
          )}
        </CardContent>
      </Card>
      <SiteSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        site={site}
      />

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-baseline justify-between">
            <CardTitle>實體地圖</CardTitle>
            <p className="text-xs text-white/60">
              gNB {gnbStations.length} · 點攝影機圖示播放
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <SiteLayoutCanvas
            siteId={site.id}
            floorPlanUrl={site.floor_plan_url || undefined}
            stations={stations}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-4">
        <CollapsibleCard
          title="邏輯拓樸"
          subtitle="SMO → RIC → gNB"
        >
          {isLoading ? (
            <div className="text-white/40 text-sm">載入中…</div>
          ) : (
            <TopologyCanvas stations={stations} links={links} />
          )}
        </CollapsibleCard>

        <CollapsibleCard
          title="網元"
          subtitle={`${stations.length} 個`}
        >
          <StationList siteId={site.id} stations={stations} />
        </CollapsibleCard>
      </div>

      <CollapsibleCard title="攝影機">
        <CameraList siteId={site.id} />
      </CollapsibleCard>

      <CollapsibleCard
        title="拓樸連線"
        subtitle={`${links.length} 條`}
        defaultOpen={false}
      >
        <TopologyLinkEditor
          siteId={site.id}
          stations={stations}
          links={links}
        />
      </CollapsibleCard>
    </div>
  );
}
