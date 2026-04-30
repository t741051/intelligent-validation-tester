"use client";
import { ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
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
        <div className="text-sm text-white/60">
          {cameras.length} 個攝影機
        </div>
        {isEditing && (
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> 新增攝影機
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="text-sm text-white/40">載入中…</div>
      ) : cameras.length === 0 ? (
        <p className="text-sm text-white/40">尚未新增攝影機</p>
      ) : (
        <div className="space-y-2">
          {cameras.map((c) => (
            <details
              key={c.id}
              className="group border border-white/10 rounded-item bg-white/[0.02]"
            >
              <summary className="p-3 flex items-center gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <ChevronRight className="w-4 h-4 text-white/40 transition-transform group-open:rotate-90 flex-shrink-0" />
                <span className="font-medium truncate min-w-0 flex-1">
                  {c.name || c.id.slice(0, 8)}
                </span>
                <Badge tone={c.status === "online" ? "green" : "gray"} className="flex-shrink-0">
                  {c.status === "online" ? "線上" : "離線"}
                </Badge>
                <div
                  className="flex gap-1 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {c.hls_url && (
                    <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); setPlaying(c); }}>
                      播放
                    </Button>
                  )}
                  {isEditing && (
                    <>
                      <Button
                        size="icon" variant="ghost" aria-label="編輯"
                        onClick={(e) => { e.preventDefault(); setEditing(c); setFormOpen(true); }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon" variant="ghost" aria-label="刪除"
                        onClick={(e) => {
                          e.preventDefault();
                          if (confirm(`刪除攝影機 ${c.name}?`)) void remove(c.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </summary>
              <div className="px-3 pb-3 text-sm text-white/70 space-y-2 border-t border-white/5 pt-2">
                <div className="font-mono text-xs break-all">
                  <span className="text-white/40">串流:</span>{" "}
                  {c.rtsp_url || c.stream_url || "(未設定)"}
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="gray">{c.resolution}</Badge>
                  <Badge tone="gray">{c.fps} fps</Badge>
                </div>
              </div>
            </details>
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
