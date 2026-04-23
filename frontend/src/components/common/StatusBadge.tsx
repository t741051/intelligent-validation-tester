import { Badge } from "@/components/ui/badge";
import { STATUS_COLOR } from "@/lib/constants";

const LABELS: Record<string, string> = {
  online: "在線", offline: "離線", error: "錯誤",
  passed: "通過", failed: "未通過", running: "進行中",
  pending: "待執行", cancelled: "已取消",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = (STATUS_COLOR as Record<string, "green" | "red" | "orange" | "gray" | "blue">)[status] ?? "gray";
  return <Badge tone={tone}>{LABELS[status] ?? status}</Badge>;
}
