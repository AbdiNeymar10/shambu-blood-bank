import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement> & {
  /** Vertical rhythm — default matches design system section spacing. */
  density?: "default" | "compact" | "hero";
};

const densityMap = {
  default: "py-16 md:py-24",
  compact: "py-10 md:py-14",
  hero: "py-20 md:py-32",
} as const;

export function Section({
  className,
  density = "default",
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(densityMap[density], className)}
      {...props}
    />
  );
}
