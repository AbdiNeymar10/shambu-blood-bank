"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  Calendar,
  Trophy,
  Megaphone,
  Settings,
  Droplet,
  LogOut,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

const donorSidebarItems = [
  { name: "Dashboard", href: "/donor", icon: LayoutDashboard },
  { name: "My Donations", href: "/donor/donations", icon: History },
  { name: "Appointments", href: "/donor/appointments", icon: Calendar },
  { name: "Impact & Badges", href: "/donor/impact", icon: Trophy },
  { name: "Campaigns", href: "/donor/campaigns", icon: Megaphone },
  { name: "Settings", href: "/donor/settings", icon: Settings },
];

export function DonorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col shadow-sm hidden md:flex">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Droplet className="w-6 h-6 text-primary fill-primary" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">Shambu</h2>
          <p className="text-xs text-muted-foreground font-medium">Donor Portal</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1.5">
          {donorSidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Next Eligibility</span>
          </div>
          <p className="text-sm font-bold text-foreground">June 15, 2026</p>
          <p className="text-[10px] text-muted-foreground mt-1">45 days remaining</p>
          <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full w-[65%]" />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              JD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">John Donor</p>
              <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight">O Positive (O+)</p>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
