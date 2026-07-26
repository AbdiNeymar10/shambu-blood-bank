"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Droplet,
  FileText,
  Megaphone,
  Calendar,
  Newspaper,
  Bell,
  BarChart,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Donors", href: "/admin/donors", icon: Users },
  { name: "Blood Inventory", href: "/admin/blood-inventory", icon: Droplet },
  { name: "Blood Requests", href: "/admin/blood-requests", icon: FileText },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
  { name: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { name: "Blog Management", href: "/admin/blog", icon: Newspaper },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Reports", href: "/admin/reports", icon: BarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<{
    fullName: string;
    email: string;
  }>({
    fullName: "Admin User",
    email: "admin@shambu.com",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        let fullName = (user.user_metadata?.full_name as string) || "";
        let email = user.email || "";

        const { data: profile } = await supabase
          .from("users")
          .select("full_name, email")
          .eq("auth_id", user.id)
          .maybeSingle();

        const userRow = profile as { full_name?: string; email?: string } | null;

        if (userRow) {
          if (userRow.full_name) fullName = userRow.full_name;
          if (userRow.email) email = userRow.email;
        }

        setAdminUser({
          fullName: fullName || "Administrator",
          email: email || user.email || "admin@shambu.com",
        });
      }
    });
  }, []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.slice(0, 2) || "AD").toUpperCase();
  };

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col shadow-sm hidden md:flex">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Droplet className="w-6 h-6 text-primary fill-primary" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">Shambu</h2>
          <p className="text-xs text-muted-foreground font-medium">Admin Portal</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1.5">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href)) ||
              (item.href === "/admin/dashboard" && (pathname === "/admin" || pathname === "/admin/dashboard"));
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
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
            {getInitials(adminUser.fullName)}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{adminUser.fullName}</p>
            <p className="text-xs text-muted-foreground truncate">{adminUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
