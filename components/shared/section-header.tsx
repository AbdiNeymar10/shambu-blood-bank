"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fadeInUp, viewportOnce } from "@/lib/motion";

export type SectionHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  eyebrow?: React.ReactNode;
  /** Optional icon rendered inside the eyebrow badge. */
  eyebrowIcon?: React.ReactNode;
  /** Color variant for the eyebrow badge pill. */
  eyebrowColor?: "primary" | "red" | "blue" | "amber" | "emerald";
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  actions?: React.ReactNode;
  /** Enable framer-motion entrance animation. Default true. */
  animated?: boolean;
};

const eyebrowColorMap = {
  primary: "bg-primary/10 text-primary",
  red: "bg-red-500/10 text-red-600",
  blue: "bg-blue-500/10 text-blue-600",
  amber: "bg-amber-500/10 text-amber-600",
  emerald: "bg-emerald-500/10 text-emerald-600",
} as const;

export function SectionHeader({
  className,
  eyebrow,
  eyebrowIcon,
  eyebrowColor = "primary",
  title,
  description,
  align = "left",
  size = "md",
  actions,
  animated = true,
  ...props
}: SectionHeaderProps) {
  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? { initial: "hidden", whileInView: "visible", viewport: viewportOnce, variants: fadeInUp }
    : {};

  return (
    <div
      className={cn(
        "mb-12 md:mb-16 flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
      {...props}
    >
      {eyebrow ? (
        <Wrapper {...(wrapperProps as any)}>
          <span
            className={cn(
              "inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full font-medium text-sm",
              eyebrowColorMap[eyebrowColor]
            )}
          >
            {eyebrowIcon}
            {eyebrow}
          </span>
        </Wrapper>
      ) : null}

      <div className="space-y-3">
        <Wrapper {...(wrapperProps as any)}>
          <h2
            className={cn(
              "font-display font-bold tracking-tight",
              size === "sm" && "text-2xl sm:text-3xl",
              size === "md" && "text-3xl md:text-4xl lg:text-5xl",
              size === "lg" && "text-4xl md:text-5xl lg:text-6xl"
            )}
          >
            {title}
          </h2>
        </Wrapper>
        {description ? (
          <Wrapper {...(wrapperProps as any)}>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              {description}
            </p>
          </Wrapper>
        ) : null}
      </div>
      {actions ? (
        <Wrapper {...(wrapperProps as any)}>
          <div className="flex flex-wrap gap-3">{actions}</div>
        </Wrapper>
      ) : null}
    </div>
  );
}
