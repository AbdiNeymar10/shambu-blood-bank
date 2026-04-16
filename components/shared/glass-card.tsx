import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { surfaceVariants } from "./styles";

export type GlassCardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof surfaceVariants>;

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, tone = "glass", padding = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(surfaceVariants({ tone, padding }), className)}
      {...props}
    />
  )
);

GlassCard.displayName = "GlassCard";
