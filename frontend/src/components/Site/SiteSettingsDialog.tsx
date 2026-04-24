"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateSite } from "@/hooks/Site/useSites";
import type { Site } from "@/types/site";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site: Site;
};

export function SiteSettingsDialog({ open, onOpenChange, site }: Props) {
  const update = useUpdateSite();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [floorPlanUrl, setFloorPlanUrl] = useState("");

  useEffect(() => {
    if (open) {
      setName(site.name);
      setAddress(site.address);
      setFloorPlanUrl(site.floor_plan_url ?? "");
    }
  }, [open, site]);

  const submit = async () => {
    await update.mutateAsync({
      id: site.id,
      input: {
        name: name.trim() || site.name,
        address: address.trim(),
        floor_plan_url: floorPlanUrl.trim(),
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>場域設定 - {site.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">名稱</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">地址</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">樓層平面圖 URL</label>
            <Input
              value={floorPlanUrl}
              onChange={(e) => setFloorPlanUrl(e.target.value)}
              placeholder="https://.../floor.png  (留空則實體地圖使用網格底)"
            />
            <p className="text-xs text-white/60 mt-1">
              支援公開 HTTP(S) 圖片 URL。實體地圖會用 contain 模式顯示。
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={update.isPending}>
            取消
          </Button>
          <Button onClick={submit} disabled={update.isPending}>
            {update.isPending ? "儲存中…" : "儲存"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
