import type { DutType } from "@/types/common";

const STYLES: Record<DutType, { bg: string; border: string; dot: string; text: string }> = {
  SMO:  { bg: "bg-blue-50",   border: "border-blue-600",   dot: "bg-blue-600",   text: "text-blue-900" },
  RIC:  { bg: "bg-green-50",  border: "border-green-600",  dot: "bg-green-600",  text: "text-green-900" },
  xApp: { bg: "bg-purple-50", border: "border-purple-600", dot: "bg-purple-600", text: "text-purple-900" },
  rApp: { bg: "bg-orange-50", border: "border-orange-600", dot: "bg-orange-600", text: "text-orange-900" },
};

export function DutTypeBanner({ dutType }: { dutType: DutType }) {
  const s = STYLES[dutType];
  return (
    <div className={`p-3 rounded-lg border ${s.bg} ${s.border} flex items-center gap-2`}>
      <div className={`w-3 h-3 rounded ${s.dot}`} />
      <span className={`text-sm font-medium ${s.text}`}>
        當前檢視:{dutType} 設備
      </span>
    </div>
  );
}
