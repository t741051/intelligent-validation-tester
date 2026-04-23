"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { SiteCamera, SiteCameraInput } from "@/types/site";

const DEFAULT: SiteCameraInput = {
  name: "",
  location: null,
  rtsp_url: "",
  stream_url: "",
  resolution: "1920x1080",
  fps: 30,
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  existing?: SiteCamera | null;
  onSubmit: (input: SiteCameraInput) => Promise<void>;
};

export function CameraFormDialog({ open, onOpenChange, isSubmitting, existing, onSubmit }: Props) {
  const [form, setForm] = useState<SiteCameraInput>(DEFAULT);
  const [x, setX] = useState("50");
  const [y, setY] = useState("50");

  useEffect(() => {
    if (!open) return;
    if (existing) {
      setForm({
        name: existing.name,
        location: existing.location,
        rtsp_url: existing.rtsp_url,
        stream_url: existing.stream_url,
        resolution: existing.resolution,
        fps: existing.fps,
      });
      const loc = existing.location as { x?: number; y?: number } | null;
      setX(loc?.x != null ? String(loc.x) : "50");
      setY(loc?.y != null ? String(loc.y) : "50");
    } else {
      setForm(DEFAULT);
      setX("50");
      setY("50");
    }
  }, [open, existing]);

  const submit = () => {
    if (!form.name) return;
    const loc =
      x !== "" && y !== ""
        ? { x: Number(x), y: Number(y) }
        : null;
    void onSubmit({ ...form, location: loc as unknown as typeof form.location });
  };

  const isEdit = !!existing;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "編輯攝影機" : "新增攝影機"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">名稱 *</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="大廳入口"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stream URL (HLS)</label>
            <Input
              value={form.stream_url ?? ""}
              onChange={(e) => setForm({ ...form, stream_url: e.target.value })}
              placeholder="https://.../stream.m3u8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">RTSP URL</label>
            <Input
              value={form.rtsp_url ?? ""}
              onChange={(e) => setForm({ ...form, rtsp_url: e.target.value })}
              placeholder="rtsp://..."
            />
            {isEdit && (
              <p className="text-xs text-gray-500 mt-1">
                修改後 MediaMTX 會自動重新註冊;清空則停止轉碼
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">地圖 X (%)</label>
              <Input
                type="number" min={0} max={100} step="0.1"
                value={x}
                onChange={(e) => setX(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">地圖 Y (%)</label>
              <Input
                type="number" min={0} max={100} step="0.1"
                value={y}
                onChange={(e) => setY(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">解析度</label>
              <Input
                value={form.resolution ?? ""}
                onChange={(e) => setForm({ ...form, resolution: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">FPS</label>
              <Input
                type="number" min={1} max={120}
                value={form.fps ?? 30}
                onChange={(e) => setForm({ ...form, fps: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            取消
          </Button>
          <Button onClick={submit} disabled={isSubmitting || !form.name}>
            {isSubmitting ? (isEdit ? "儲存中…" : "建立中…") : (isEdit ? "儲存" : "新增")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
