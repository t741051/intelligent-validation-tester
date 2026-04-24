"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CollapsibleCard({
  title,
  subtitle,
  extra,
  defaultOpen = true,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 flex-1 min-w-0 text-left"
          >
            {open ? (
              <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
            )}
            <div className="font-semibold leading-none">{title}</div>
            {subtitle && (
              <span className="text-xs text-white/60 truncate">{subtitle}</span>
            )}
          </button>
          {extra && <div className="shrink-0">{extra}</div>}
        </div>
      </CardHeader>
      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
}
