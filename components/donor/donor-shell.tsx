"use client";

import { useState } from "react";
import { DonorSidebar } from "./donor-sidebar";
import { DonorHeader } from "./donor-header";

export function DonorShell({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <DonorSidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <DonorHeader onOpenMobile={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-6 bg-secondary/10">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
