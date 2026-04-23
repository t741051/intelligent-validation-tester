import type { ReactNode } from "react";

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-6">
      <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}
