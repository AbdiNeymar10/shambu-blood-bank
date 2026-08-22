"use client";

import { useEffect, useState } from "react";
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
import { getDonorCampaigns, type CampaignRecord } from "@/lib/actions/campaigns";

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
  { id: "1", date: "Oct 15, 2026", center: "Shambu General Hospital", status: "Completed", volume: "450 ml" },
  { id: "2", date: "Jul 22, 2026", center: "Fincha Valley Outreach", status: "Completed", volume: "450 ml" },
  { id: "3", date: "Apr 10, 2026", center: "Shambu Town Clinic", status: "Completed", volume: "450 ml" },
];

export default function DonorDashboardPage() {
  const [activeDrives, setActiveDrives] = useState<CampaignRecord[]>([]);
  const [isLoadingDrives, setIsLoadingDrives] = useState(true);

  useEffect(() => {
    async function loadActiveDrives() {
      setIsLoadingDrives(true);
      const res = await getDonorCampaigns();
      setActiveDrives(res.campaigns.slice(0, 3));
      setIsLoadingDrives(false);
    }
    loadActiveDrives();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-primary to-rose-700 p-8 text-white shadow-xl shadow-primary/10">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none font-bold text-xs uppercase tracking-wider">
              Life Saver Status: Active
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
              Welcome back, Hero!
            </h1>
            <p className="text-white/80 text-sm leading-relaxed">
              Your last donation on October 15, 2026 helped save up to 3 lives. Thank you for your continued dedication to the Shambu community.
            </p>
          </div>
          <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 font-bold rounded-2xl shadow-lg shrink-0 border-none">
            <a href="/donate">
              <Plus className="w-5 h-5 mr-2" /> Book Next Donation
            </a>
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-border/60 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl ${stat.bgLight} ${stat.textColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-3xl font-extrabold tracking-tight text-foreground">{stat.value}</h3>
                  <p className="text-xs font-bold text-foreground">{stat.label}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{stat.subtext}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Donation History */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Recent Donation History</CardTitle>
                <CardDescription>Your recent contributions and centers visited</CardDescription>
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

        {/* Live Active Blood Drives Card */}
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" /> Active Local Blood Drives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingDrives ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  Loading active blood drives...
                </div>
              ) : activeDrives.length === 0 ? (
                <div className="p-4 rounded-xl bg-secondary/50 border border-border text-center space-y-2">
                  <p className="text-xs text-muted-foreground">No active blood drives right now.</p>
                  <Button size="sm" variant="outline" asChild className="w-full font-bold">
                    <a href="/donor/campaigns">Browse All Campaigns</a>
                  </Button>
                </div>
              ) : (
                activeDrives.map((drive) => {
                  const driveImg = drive.imageUrl || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800";
                  return (
                    <div key={drive.id} className="rounded-xl border border-border overflow-hidden bg-card space-y-3 group hover:shadow-md transition-all">
                      <div className="h-32 w-full overflow-hidden relative">
                        <img 
                          src={driveImg} 
                          alt={drive.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-primary uppercase">
                          {drive.status}
                        </div>
                      </div>
                      <div className="p-4 pt-1 space-y-2">
                        <h4 className="font-bold text-sm text-foreground line-clamp-1">{drive.title}</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary shrink-0" /> {drive.location}</p>
                          <p className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary shrink-0" /> {drive.formattedDates}</p>
                        </div>
                        <Button size="sm" variant="outline" asChild className="w-full mt-2 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <a href="/donor/campaigns">Register for Drive</a>
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
