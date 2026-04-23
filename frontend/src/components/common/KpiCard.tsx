import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  value: string;
  hint?: string;
  tone?: "blue" | "green" | "orange" | "purple";
};

const tones = {
  blue: "border-l-4 border-blue-600",
  green: "border-l-4 border-green-600",
  orange: "border-l-4 border-orange-600",
  purple: "border-l-4 border-purple-600",
};

export function KpiCard({ label, value, hint, tone = "blue" }: Props) {
  return (
    <Card className={cn(tones[tone])}>
      <CardContent className="p-4 md:p-6">
        <p className="text-xs md:text-sm text-gray-500">{label}</p>
        <p className="text-2xl md:text-3xl font-semibold mt-1">{value}</p>
        {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}
