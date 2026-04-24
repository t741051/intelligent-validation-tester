import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-item border border-white/15 bg-white/5 px-3 py-1 text-sm text-white",
        "placeholder:text-white/40",
        "hover:border-white/25",
        "focus-visible:outline-none focus-visible:border-mint-300 focus-visible:ring-1 focus-visible:ring-mint-300",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
