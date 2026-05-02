import * as React from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Width variant — default (7xl), narrow (5xl), wide (90rem). */
  size?: "default" | "narrow" | "wide";
};

const sizeMap = {
  default: "max-w-7xl",
  narrow: "max-w-5xl",
  wide: "max-w-[90rem]",
} as const;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeMap[size],
        className
      )}
      {...props}
    />
  )
);
Container.displayName = "Container";
