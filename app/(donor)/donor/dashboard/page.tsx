"use client";

import {
  Heart,
  Droplet,
  Calendar,
  Trophy,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Star,
  Award,
  Zap,
  Megaphone,
  TrendingUp,
  MapPin,
  Flame,
  Gift,
  ChevronRight,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Total Donations",
    value: "12",
    subtext: "+2 this year",
    icon: Droplet,
    gradient: "from-rose-500 to-red-600",
    bgLight: "bg-rose-50 dark:bg-rose-950/40",
    textColor: "text-rose-600 dark:text-rose-400",
  },
  {
    label: "Lives Saved",
    value: "36",
    subtext: "3 per donation",
    icon: Heart,
    gradient: "from-red-500 to-pink-600",
    bgLight: "bg-red-50 dark:bg-red-950/40",
    textColor: "text-red-600 dark:text-red-400",
  },
  {
    label: "Blood Type",
    value: "O+",
    subtext: "Universal donor",
    icon: Zap,
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/40",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Loyalty Points",
    value: "1,250",
    subtext: "250 to Silver II",
    icon: Trophy,
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
];

const recentDonations = [
  { id: "don-1", date: "2026-03-12", center: "Shambu General Hospital", volume: "450 ml", status: "Completed" },
  { id: "don-2", date: "2025-11-20", center: "Fincha Valley Drive", volume: "450 ml", status: "Completed" },
  { id: "don-3", date: "2025-07-15", center: "Shambu General Hospital", volume: "450 ml", status: "Completed" },
];

export default function DonorDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/15 via-rose-500/10 to-background border border-primary/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <Badge className="bg-primary text-primary-foreground font-semibold">Verified Active Donor</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Welcome Back, John!</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your next blood donation eligibility date is <strong className="text-foreground">June 15, 2026</strong>. Thank you for saving lives in Shambu!
          </p>
        </div>
        <Button asChild size="lg" className="rounded-xl shadow-lg shadow-primary/20 font-bold gap-2 shrink-0">
          <a href="/donor/appointments">
            <Plus className="w-5 h-5" /> Book Next Appointment
          </a>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${stat.bgLight}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">{stat.subtext}</span>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-extrabold text-foreground mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Donation History Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/60">
              <div>
                <CardTitle className="text-lg font-bold">Recent Donation History</CardTitle>
                <CardDescription>Your recent voluntary blood contributions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-primary font-bold">
                <a href="/donor/donations">View All History <ChevronRight className="w-4 h-4 ml-1" /></a>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                {recentDonations.map((don) => (
                  <div key={don.id} className="p-5 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                        <Droplet className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{don.center}</p>
                        <p className="text-xs text-muted-foreground">{don.date} • {don.volume}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-none">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {don.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Local Drives & Notifications Card */}
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" /> Active Local Blood Drives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Shambu Town</span>
                <h4 className="font-bold text-sm text-foreground">Fincha Valley Sugar Factory Outreach</h4>
                <p className="text-xs text-muted-foreground"><Calendar className="w-3 h-3 inline mr-1" /> July 20 – 28, 2026</p>
                <Button size="sm" variant="outline" asChild className="w-full mt-2 font-bold">
                  <a href="/donor/campaigns">Register for Drive</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
