"use client";
import { Settings2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteTopology } from "@/hooks/Site/useSiteTopology";
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>{site.name}</CardTitle>
              <div className="text-sm text-gray-500 space-x-3 mt-1">
                <span>環境:{ENV_LABEL[site.environment] ?? site.environment}</span>
                <span>地址:{site.address || "—"}</span>
                {site.floor_plan_url ? (
                  <span className="text-green-700">已設定平面圖</span>
                ) : (
                  <span className="text-gray-400">未設定平面圖(使用網格底)</span>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
              <Settings2 className="w-4 h-4 mr-2" /> 場域設定
            </Button>
          </div>
        </CardHeader>
      </Card>
      <SiteSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        site={site}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>邏輯拓樸</CardTitle>
            <p className="text-xs text-gray-500">
              SMO → RIC → gNB 層級關係,不代表實際位置
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-gray-400">載入中…</div>
            ) : (
              <TopologyCanvas stations={stations} links={links} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>實體地圖</CardTitle>
            <p className="text-xs text-gray-500">
              gNB 相對位置 · {gnbStations.length} 個
            </p>
          </CardHeader>
          <CardContent>
            <SiteLayoutCanvas
              siteId={site.id}
              floorPlanUrl={site.floor_plan_url || undefined}
              stations={stations}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>網元</CardTitle></CardHeader>
          <CardContent>
            <StationList siteId={site.id} stations={stations} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>拓樸連線</CardTitle></CardHeader>
          <CardContent>
            <TopologyLinkEditor
              siteId={site.id}
              stations={stations}
              links={links}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>攝影機</CardTitle></CardHeader>
        <CardContent>
          <CameraList siteId={site.id} />
        </CardContent>
      </Card>
    </div>
  );
}
