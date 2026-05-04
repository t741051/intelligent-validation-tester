"use client";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Tailwind-styled dropdown that replaces native <select>. The native popup
 * isn't affected by `body { transform: scale() }`, so in wall-mode preview
 * the dropdown would render at raw CSS px (huge) and overflow the viewport.
 * This component renders the listbox as a normal absolutely-positioned div
 * inside the React tree, so it scales with everything else.
 */
type Option = { value: string; label: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  id?: string;
};

export function SelectButton({ value, onChange, options, placeholder, id }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between rounded-item border border-white/20 bg-navy-400 text-white px-3 text-base"
      >
        <span className="truncate">
          {current?.label ?? (
            <span className="text-white/40">{placeholder ?? "—"}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 ml-2 shrink-0 text-white/60 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute z-20 left-0 right-0 mt-1 max-h-80 overflow-y-auto rounded-item border border-white/20 bg-navy-500 shadow-lg">
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-base text-left transition-colors ${
                  active
                    ? "bg-mint-300/10 text-mint-300"
                    : "text-white hover:bg-white/5"
                }`}
              >
                <span className="truncate">{o.label}</span>
                {active && <Check className="w-4 h-4 ml-2 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
