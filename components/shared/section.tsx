import * as React from "react";
import { cn } from "@/lib/utils";

const densityMap = {
  default: "py-16 md:py-24",
  compact: "py-10 md:py-14",
  hero: "py-20 md:py-32",
} as const;

export type SectionDensity = keyof typeof densityMap;

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Vertical rhythm — matches design system section spacing. */
  density?: SectionDensity;
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, density = "default", ...props }, ref) => (
    <section
      ref={ref}
      className={cn(densityMap[density], className)}
      {...props}
    />
  )
);
Section.displayName = "Section";
