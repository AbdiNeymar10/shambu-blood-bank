import { HeartHandshake } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "./primary-button";
import { SecondaryButton } from "./secondary-button";
import { SectionShell, SectionSurface } from "./section-shell";

export type CTASectionProps = {
  eyebrow?: React.ReactNode;
  title: string;
  description: React.ReactNode;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
};

export function CTASection({
  eyebrow = "Support life-saving action",
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
}: CTASectionProps) {
  return (
    <SectionShell sectionProps={{ density: "compact" }}>
      <SectionSurface
        tone="muted"
        className={cn(
          "bg-gradient-to-br from-primary/10 via-accent-crimson/10 to-card",
          className
        )}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <HeartHandshake className="size-4" />
              {eyebrow}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h3>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <PrimaryButton asChild>
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </PrimaryButton>
            {secondaryCta ? (
              <SecondaryButton asChild>
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </SecondaryButton>
            ) : null}
          </div>
        </div>
      </SectionSurface>
    </SectionShell>
  );
}
