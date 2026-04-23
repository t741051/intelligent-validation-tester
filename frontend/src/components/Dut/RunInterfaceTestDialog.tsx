"use client";
import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Dut } from "@/types/dut";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dut: Dut | null;
  onRun: () => Promise<void> | void;
  isRunning?: boolean;
};

export function RunInterfaceTestDialog({ open, onOpenChange, dut, onRun, isRunning }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>執行介面測試</DialogTitle>
          <DialogDescription>
            測試 {dut?.name} 的連接和資料格式
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">測試介面</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {(dut?.interfaces ?? []).map((iface, idx) => (
                <li key={iface}>
                  {idx + 1}. {iface} 介面:連接測試、資料格式驗證、回應時間測量
                </li>
              ))}
              {(dut?.interfaces ?? []).length === 0 && (
                <li className="text-blue-900/70">此設備未設定任何介面</li>
              )}
            </ul>
          </div>
          <div className="border rounded-lg p-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">預估測試時間</span>
              <span className="text-gray-600">約 30 秒</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">測試端點</span>
              <span className="font-mono text-xs text-gray-600">{dut?.endpoint}</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isRunning}>
              取消
            </Button>
            <Button onClick={onRun} disabled={isRunning || !dut}>
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "測試中…" : "開始測試"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
