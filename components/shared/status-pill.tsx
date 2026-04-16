import * as React from "react";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusPillVariants = cva("font-semibold", {
  variants: {
    status: {
      active: "bg-emerald-500/15 text-emerald-700 border-emerald-300/50",
      available: "bg-blue-500/15 text-blue-700 border-blue-300/50",
      urgent: "bg-destructive text-destructive-foreground border-transparent",
      critical: "bg-red-600 text-white border-transparent",
      upcoming: "bg-amber-500/15 text-amber-700 border-amber-300/50",
      closed: "bg-slate-500/15 text-slate-700 border-slate-300/50",
    },
  },
});

export type StatusPillType = NonNullable<
  Parameters<typeof statusPillVariants>[0]
>["status"];

export type StatusPillProps = React.ComponentPropsWithoutRef<typeof Badge> & {
  status: StatusPillType;
};

export function StatusPill({ status, className, ...props }: StatusPillProps) {
  return (
    <Badge
      variant="outline"
      className={cn(statusPillVariants({ status }), className)}
      {...props}
    />
  );
}
