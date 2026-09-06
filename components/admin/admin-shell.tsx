"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isMobileOpen={isMobileOpen} onCloseMobile={() => setIsMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobile={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-secondary/20">
          {children}
        </main>
      </div>
    </div>
  );
}
