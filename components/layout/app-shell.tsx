import type { ReactNode } from "react";
import { Footer, Navbar } from "@/components/shared";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Root page chrome: full-height column, background, and main landmark.
 * Add header/footer as siblings inside `main` or wrap children when routes grow.
 */
export function AppShell({ children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-background text-foreground",
        className
      )}
    >
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
