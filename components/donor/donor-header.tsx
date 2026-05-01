"use client";

import { Bell, Search, Menu, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DonorHeader() {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
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
        <div className="relative group">
          <Button variant="outline" size="icon" className="rounded-full relative border-border/50">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </Button>
          {/* Simple notification badge for UI only */}
        </div>

        <div className="h-8 w-[1px] bg-border mx-1" />

        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">John Donor</p>
            <p className="text-[11px] text-muted-foreground font-medium mt-1">Level 4 Life Saver</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
            <User className="w-5 h-5 text-primary" />
          </Button>
        </div>
      </div>
    </header>
  );
}
