import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MainShellProps = {
  children: ReactNode;
  className?: string;
};

export function MainShell({ children, className }: MainShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-background text-foreground", className)}>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
