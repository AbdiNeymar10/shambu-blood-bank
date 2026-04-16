import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Container, type ContainerProps } from "./container";
import { Section, type SectionProps } from "./section";
import { surfaceVariants } from "./styles";

export type SectionShellProps = {
  sectionProps?: Omit<SectionProps, "children">;
  containerProps?: Omit<ContainerProps, "children">;
  children: React.ReactNode;
};

export function SectionShell({
  sectionProps,
  containerProps,
  children,
}: SectionShellProps) {
  return (
    <Section {...sectionProps}>
      <Container {...containerProps}>{children}</Container>
    </Section>
  );
}

export function SectionSurface({
  className,
  tone = "default",
  padding = "lg",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof surfaceVariants>) {
  return (
    <div
      className={cn(surfaceVariants({ tone, padding }), "rounded-3xl", className)}
      {...props}
    />
  );
}
