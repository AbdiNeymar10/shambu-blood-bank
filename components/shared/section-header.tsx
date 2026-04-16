import * as React from "react";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

export type SectionHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  eyebrow?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  actions?: React.ReactNode;
};

export function SectionHeader({
  className,
  eyebrow,
  title,
  description,
  align = "left",
  size = "md",
  actions,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
      {...props}
    >
      {eyebrow ? <Badge variant="soft">{eyebrow}</Badge> : null}
      <div className="space-y-2">
        <h2
          className={cn(
            "font-semibold tracking-tight",
            size === "sm" && "text-2xl sm:text-3xl",
            size === "md" && "text-3xl sm:text-4xl",
            size === "lg" && "text-4xl sm:text-5xl"
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
