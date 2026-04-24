import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
  {
    variants: {
      tone: {
        green: "border-mint-300/40 bg-mint-300/15 text-mint-300",
        red: "border-danger/40 bg-danger/15 text-danger",
        orange: "border-warning/40 bg-warning/15 text-warning",
        blue: "border-teal/40 bg-teal/15 text-teal",
        gray: "border-white/15 bg-white/5 text-white/70",
      },
    },
    defaultVariants: { tone: "gray" },
  },
);

type Props = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: Props) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
