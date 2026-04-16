import { ArrowRight } from "lucide-react";
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import { surfaceVariants } from "./styles";

export type FeatureCardProps = React.ComponentPropsWithoutRef<typeof Card> & {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function FeatureCard({
  className,
  icon,
  title,
  description,
  actionHref,
  actionLabel,
  ...props
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        surfaceVariants({ interactive: true }),
        className
      )}
      {...props}
    >
      <CardHeader>
        {icon ? <div className="mb-3 text-primary">{icon}</div> : null}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {actionLabel ? (
        <CardContent className="pt-0 text-sm font-medium text-primary">
          {actionHref ? (
            <a href={actionHref} className="inline-flex items-center gap-1.5">
              {actionLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              {actionLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </CardContent>
      ) : null}
    </Card>
  );
}
