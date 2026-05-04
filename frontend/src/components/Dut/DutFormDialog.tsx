"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SelectButton } from "@/components/ui/select-button";
import { useIsWallMode } from "@/stores/wallModeStore";
import type { DutType, Interface } from "@/types/common";
import type { DutInput } from "@/types/dut";
import {
  AVAILABLE_INTERFACES,
  DEFAULT_INTERFACES,
} from "@/types/dut";
import type { Site } from "@/types/site";

const ENV_LABEL: Record<string, string> = {
  indoor: "室內",
  outdoor: "室外",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dutType: DutType;
  sites: Site[];
  onSubmit: (input: DutInput) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function DutFormDialog({
  open,
  onOpenChange,
  dutType,
  sites,
  onSubmit,
  isSubmitting,
}: Props) {
  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [siteId, setSiteId] = useState("");
  const [interfaces, setInterfaces] = useState<Interface[]>(DEFAULT_INTERFACES[dutType]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isWall = useIsWallMode();

  useEffect(() => {
    if (open) {
      setName("");
      setEndpoint("");
      setSiteId(sites[0]?.id ?? "");
      setInterfaces(DEFAULT_INTERFACES[dutType]);
      setSubmitError(null);
    }
  }, [open, dutType, sites]);

  const toggleInterface = (iface: Interface) => {
    setInterfaces((prev) =>
      prev.includes(iface) ? prev.filter((i) => i !== iface) : [...prev, iface],
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!name.trim() || !endpoint.trim() || !siteId) return;
    try {
      await onSubmit({
        site: siteId,
        name: name.trim(),
        type: dutType,
        endpoint: endpoint.trim(),
        interfaces,
      });
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { error?: { details?: Record<string, string[]> } } } })
        .response?.data?.error?.details;
      if (detail) {
        const lines = Object.entries(detail).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`);
        setSubmitError(lines.join("\n"));
      } else {
        setSubmitError("新增失敗,請稍後再試");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新增 {dutType} 設備</DialogTitle>
          <DialogDescription>填寫 {dutType} 設備的連接資訊</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {/* 電視牆模式:左右兩欄,左邊基本資訊、右邊測試介面;一般模式維持單欄。 */}
          <div className={isWall ? "grid grid-cols-2 gap-6" : "space-y-4"}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="dut-name">設備名稱</label>
                <Input
                  id="dut-name"
                  placeholder="輸入設備名稱"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="dut-site">部署場域</label>
                <SelectButton
                  id="dut-site"
                  value={siteId}
                  onChange={setSiteId}
                  placeholder={sites.length === 0 ? "（尚無場域）" : undefined}
                  options={sites.map((s) => ({
                    value: s.id,
                    label: `${s.name}（${ENV_LABEL[s.environment] ?? s.environment}）`,
                  }))}
                />
                <p className="text-xs text-white/60">
                  DUT 部署在哪個場域。環境類別由場域決定,若無合適場域請先到「場域管理」建立。
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="dut-endpoint">API Endpoint</label>
                <Input
                  id="dut-endpoint"
                  placeholder="192.168.1.100:8080 或 http://smo.example.com/api"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  required
                />
                <p className="text-xs text-white/60">
                  可填 IP、主機名或完整 URL。建立時不會測試連線,按「執行介面測試」才會實際連線。
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">測試介面</label>
              <div className="border rounded-item p-3 bg-white/5 grid grid-cols-2 gap-3">
                {AVAILABLE_INTERFACES[dutType].map((iface) => (
                  <label key={iface} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20"
                      checked={interfaces.includes(iface)}
                      onChange={() => toggleInterface(iface)}
                    />
                    <span className="text-sm">{iface} 介面</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting || !siteId}>
              {isSubmitting ? "送出中…" : "新增設備"}
            </Button>
          </div>
          {sites.length === 0 && (
            <p className="text-xs text-warning">
              系統尚未偵測到任何場域,請先於「場域管理」建立場域。
            </p>
          )}
          {submitError && (
            <p className="whitespace-pre-line rounded-item border border-danger/40 bg-danger/10 p-2 text-xs text-danger">
              {submitError}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
