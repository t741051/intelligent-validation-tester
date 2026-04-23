"use client";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSiteCameras } from "@/hooks/Site/useSiteCameras";
import { useIsEditing } from "@/stores/editModeStore";
import type { SiteCamera } from "@/types/site";

import { CameraFormDialog } from "./CameraFormDialog";
import { HlsPlayer } from "./HlsPlayer";

export function CameraList({ siteId }: { siteId: string }) {
  const {
    cameras, isLoading,
    create, isCreating,
    update, isUpdating,
    remove,
  } = useSiteCameras(siteId);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SiteCamera | null>(null);
  const [playing, setPlaying] = useState<SiteCamera | null>(null);
  const isEditing = useIsEditing();

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-500">
          {cameras.length} 個攝影機
        </div>
        {isEditing && (
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> 新增攝影機
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="text-sm text-gray-400">載入中…</div>
      ) : cameras.length === 0 ? (
        <p className="text-sm text-gray-400">尚未新增攝影機</p>
      ) : (
        <div className="space-y-2">
          {cameras.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="min-w-0">
                <div className="font-medium">{c.name || c.id.slice(0, 8)}</div>
                <div className="text-xs text-gray-500 font-mono truncate max-w-xs">
                  {c.rtsp_url || c.stream_url || "(未設定串流)"}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge tone="gray">{c.resolution}</Badge>
                  <Badge tone="gray">{c.fps} fps</Badge>
                  <Badge tone={c.status === "online" ? "green" : "gray"}>
                    {c.status === "online" ? "線上" : "離線"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                {c.hls_url && (
                  <Button size="sm" variant="outline" onClick={() => setPlaying(c)}>
                    播放
                  </Button>
                )}
                {isEditing && (
                  <>
                    <Button
                      size="icon" variant="ghost" aria-label="編輯"
                      onClick={() => { setEditing(c); setFormOpen(true); }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon" variant="ghost" aria-label="刪除"
                      onClick={() => {
                        if (confirm(`刪除攝影機 ${c.name}?`)) void remove(c.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CameraFormDialog
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
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <Dialog open={!!playing} onOpenChange={(v) => !v && setPlaying(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{playing?.name}</DialogTitle>
          </DialogHeader>
          {playing?.hls_url && <HlsPlayer src={playing.hls_url} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
