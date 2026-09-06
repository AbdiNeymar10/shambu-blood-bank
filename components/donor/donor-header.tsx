"use client";

import Link from "next/link";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared";

export function DonorHeader({ onOpenMobile }: { onOpenMobile?: () => void }) {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobile} title="Open Menu">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search for blood camps, blogs..." 
            className="pl-10 bg-secondary/50 border-none focus-visible:ring-primary/20"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link href="/donor/notifications">
          <Button variant="outline" size="icon" className="rounded-full relative border-border/50 hover:bg-secondary transition-colors" title="Notifications">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
