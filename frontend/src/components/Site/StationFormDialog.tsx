"use client";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { BaseStationInput, NodeType } from "@/types/site";

const NODE_OPTIONS: { value: NodeType; label: string }[] = [
  { value: "gnb", label: "gNB" },
  { value: "smo", label: "SMO" },
  { value: "ric", label: "RIC" },
];

type ConfigSchema = {
  key: string;
  label: string;
  type?: "text" | "number";
  placeholder?: string;
}[];

// type-specific config fields (stored into `config` JSON)
const CONFIG_SCHEMA: Record<NodeType, ConfigSchema> = {
  gnb: [
    { key: "gnb_id", label: "gNB ID", placeholder: "例:0x1A2B3" },
    { key: "plmn_id", label: "PLMN ID", placeholder: "例:46692" },
    { key: "tac", label: "TAC", placeholder: "Tracking Area Code" },
    { key: "cell_count", label: "Cell 數", type: "number" },
  ],
  smo: [
    { key: "endpoint_url", label: "Endpoint URL", placeholder: "https://smo.example/api" },
    { key: "interfaces", label: "介面(逗號分隔)", placeholder: "O1, A1" },
    { key: "api_token", label: "API Token" },
  ],
  ric: [
    { key: "endpoint_url", label: "Endpoint URL", placeholder: "https://ric.example/api" },
    { key: "interfaces", label: "介面(逗號分隔)", placeholder: "A1, E2" },
    { key: "api_token", label: "API Token" },
  ],
};

const DEFAULT: BaseStationInput = {
  code: "",
  name: "",
  node_type: "gnb",
  mgmt_ip: null,
  mgmt_port: null,
  vendor: "",
  model: "",
  config: {},
  position: { x: 50, y: 50 },
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (input: BaseStationInput) => Promise<void>;
};

type ApiError = {
  response?: { data?: { error?: { message?: string; details?: Record<string, unknown> } } };
  message?: string;
};

function extractError(err: unknown): string {
  const e = err as ApiError;
  const details = e.response?.data?.error?.details;
  if (details && typeof details === "object") {
    return Object.entries(details)
      .map(([k, v]) => `${k}:${Array.isArray(v) ? v.join(", ") : v}`)
      .join(" / ");
  }
  return e.response?.data?.error?.message ?? e.message ?? "未知錯誤";
}

export function StationFormDialog({ open, onOpenChange, isSubmitting, onSubmit }: Props) {
  const [form, setForm] = useState<BaseStationInput>(DEFAULT);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(DEFAULT);
      setError(null);
    }
  }, [open]);

  const schema = useMemo(() => CONFIG_SCHEMA[form.node_type], [form.node_type]);

  const updateConfig = (key: string, value: string) => {
    setForm((f) => ({ ...f, config: { ...(f.config ?? {}), [key]: value } }));
  };

  const submit = async () => {
    if (!form.code || !form.name) return;
    const cleanedConfig: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(form.config ?? {})) {
      if (v !== "" && v != null) cleanedConfig[k] = v;
    }
    setError(null);
    try {
      await onSubmit({
        ...form,
        mgmt_ip: form.mgmt_ip || null,
        mgmt_port: form.mgmt_port ?? null,
        config: cleanedConfig,
      });
    } catch (err) {
      setError(extractError(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新增網元</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">類型 *</label>
              <select
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                value={form.node_type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    node_type: e.target.value as NodeType,
                    config: {},
                  })
                }
              >
                {NODE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Code *</label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="gnb-001"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">名稱 *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="北側 gNB"
              />
            </div>
          </div>

          <fieldset className="border rounded-md p-3 space-y-3">
            <legend className="text-sm font-medium px-2">管理資訊</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">管理 IP</label>
                <Input
                  value={form.mgmt_ip ?? ""}
                  onChange={(e) => setForm({ ...form, mgmt_ip: e.target.value })}
                  placeholder="192.168.1.10"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Port</label>
                <Input
                  type="number"
                  value={form.mgmt_port ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mgmt_port: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  placeholder="22 / 830 / 161"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">廠商</label>
                <Input
                  value={form.vendor ?? ""}
                  onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">型號</label>
                <Input
                  value={form.model ?? ""}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
              </div>
            </div>
          </fieldset>

          {form.node_type === "gnb" && (
            <fieldset className="border rounded-md p-3 space-y-3">
              <legend className="text-sm font-medium px-2">
                實體地圖位置(%,0-100;之後可拖拉微調)
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">X(橫向)</label>
                  <Input
                    type="number" min={0} max={100} step="0.1"
                    value={form.position?.x ?? 50}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        position: {
                          x: Number(e.target.value),
                          y: form.position?.y ?? 50,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Y(縱向)</label>
                  <Input
                    type="number" min={0} max={100} step="0.1"
                    value={form.position?.y ?? 50}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        position: {
                          x: form.position?.x ?? 50,
                          y: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </fieldset>
          )}

          {schema.length > 0 && (
            <fieldset className="border rounded-md p-3 space-y-3">
              <legend className="text-sm font-medium px-2">
                {form.node_type.toUpperCase()} 專屬設定
              </legend>
              <div className="grid grid-cols-2 gap-4">
                {schema.map((f) => (
                  <div key={f.key} className={schema.length === 1 ? "col-span-2" : ""}>
                    <label className="block text-xs text-gray-600 mb-1">{f.label}</label>
                    <Input
                      type={f.type ?? "text"}
                      value={(form.config?.[f.key] as string | number) ?? ""}
                      onChange={(e) => updateConfig(f.key, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          )}
        </div>
        {error && (
          <p className="mt-3 whitespace-pre-line rounded-md border border-red-300 bg-red-50 p-2 text-xs text-red-700">
            新增失敗:{error}
          </p>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            取消
          </Button>
          <Button
            onClick={submit}
            disabled={isSubmitting || !form.code || !form.name}
          >
            {isSubmitting ? "新增中…" : "新增"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
