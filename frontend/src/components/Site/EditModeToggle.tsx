"use client";
import { Eye, Pencil } from "lucide-react";

import { useEditModeStore } from "@/stores/editModeStore";

export function EditModeToggle() {
  const isEditing = useEditModeStore((s) => s.isEditing);
  const setEditing = useEditModeStore((s) => s.setEditing);

  return (
    <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 p-0.5 text-sm">
      <button
        type="button"
        onClick={() => setEditing(false)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
          !isEditing
            ? "bg-white/10 text-white shadow-sm"
            : "text-white/60 hover:text-white/80"
        }`}
      >
        <Eye className="h-3.5 w-3.5" />
        檢視
      </button>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
          isEditing
            ? "bg-mint-300 text-navy shadow-mint-glow"
            : "text-white/60 hover:text-white/80"
        }`}
      >
        <Pencil className="h-3.5 w-3.5" />
        編輯
      </button>
    </div>
  );
}
