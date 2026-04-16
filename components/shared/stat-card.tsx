import * as React from "react";
import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import { surfaceVariants } from "./styles";

export type StatCardProps = React.ComponentPropsWithoutRef<typeof Card> & {
  label: string;
  value: string;
  trend?: string;
  icon?: React.ReactNode;
  align?: "left" | "center";
};

export function StatCard({
  className,
  label,
  value,
  trend,
  icon,
  align = "left",
  ...props
}: StatCardProps) {
  return (
    <Card
      className={cn(
        surfaceVariants(),
        className
      )}
      {...props}
    >
      <CardContent
        className={cn(
          "flex items-start justify-between gap-4 p-6",
          align === "center" && "flex-col items-center text-center"
        )}
      >
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
          {trend ? <p className="mt-2 text-sm text-primary">{trend}</p> : null}
        </div>
        {icon ? (
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">{icon}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
