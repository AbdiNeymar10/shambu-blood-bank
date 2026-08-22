"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  History,
  Calendar,
  Megaphone,
  Bell,
  Settings,
  LogOut,
  Heart,
  Droplet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { getEligibilityInfo, type EligibilityInfo } from "@/lib/actions/eligibility";

const donorSidebarItems = [
  { name: "Dashboard", href: "/donor/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/donor/profile", icon: User },
  { name: "My Donations", href: "/donor/donations", icon: History },
  { name: "Appointments", href: "/donor/appointments", icon: Calendar },
  { name: "Campaigns", href: "/donor/campaigns", icon: Megaphone },
  { name: "Next Eligibility", href: "/donor/eligibility", icon: Heart },
  { name: "Notifications", href: "/donor/notifications", icon: Bell },
  { name: "Settings", href: "/donor/settings", icon: Settings },
];

export function DonorSidebar() {
  const pathname = usePathname();
  const [donorName, setDonorName] = useState<string>("Donor");
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [eligibility, setEligibility] = useState<EligibilityInfo | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        let name = (user.user_metadata?.full_name as string) || "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: userRow } = await (supabase as any)
          .from("users")
          .select("id, full_name")
          .eq("auth_id", user.id)
          .maybeSingle();

        if (userRow?.full_name) {
          name = userRow.full_name;
        }

        setDonorName(name || "Donor User");

        if (userRow?.id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: dp } = await (supabase as any)
            .from("donor_profiles")
            .select("blood_group")
            .eq("user_id", userRow.id)
            .maybeSingle();

          if (dp?.blood_group) {
            setBloodGroup(dp.blood_group);
          }
        }
      }
    });

    // Load eligibility info
    getEligibilityInfo().then((info) => setEligibility(info));
  }, []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.slice(0, 2) || "DU").toUpperCase();
  };

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col shadow-sm hidden md:flex shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Droplet className="w-6 h-6 text-primary fill-primary" />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">Shambu</h2>
          <p className="text-xs text-muted-foreground font-medium">Donor Portal</p>
        </div>
      </div>

      {/* Nav Items & Eligibility Info */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-1">
          {donorSidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Eligibility Quick Status Card */}
        <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Heart className="w-3.5 h-3.5 text-primary" />
            <span>Next Donation Status</span>
          </div>

          {eligibility ? (
            eligibility.isEligible ? (
              <>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Eligible Today!</p>
                <p className="text-[10px] text-muted-foreground mt-1">You are clear to schedule your next blood donation.</p>
                <div className="w-full bg-emerald-500/20 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full" />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-foreground">{eligibility.nextEligibleFormatted}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{eligibility.daysRemaining} days remaining</p>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${eligibility.progressPercent}%` }} />
                </div>
              </>
            )
          ) : (
            <>
              <p className="text-sm font-bold text-foreground">—</p>
              <p className="text-[10px] text-muted-foreground mt-1">Loading...</p>
              <div className="w-full bg-secondary h-1.5 rounded-full mt-2" />
            </>
          )}
        </div>
      </div>

      {/* Footer Profile Card */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl group border border-border/50">
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {getInitials(donorName)}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-bold truncate text-foreground">{donorName}</p>
              <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight">
                {bloodGroup ? `Blood Type: ${bloodGroup}` : "Registered Donor"}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0 ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
