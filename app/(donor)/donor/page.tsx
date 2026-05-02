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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const stats = [
  {
    label: "Total Donations",
    value: "12",
    subtext: "+2 this year",
    icon: Droplet,
    gradient: "from-rose-500 to-red-600",
    bgLight: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    label: "Lives Saved",
    value: "36",
    subtext: "3 per donation",
    icon: Heart,
    gradient: "from-red-500 to-pink-600",
    bgLight: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    label: "Blood Type",
    value: "O+",
    subtext: "Universal donor",
    icon: Zap,
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    label: "Loyalty Points",
    value: "1,250",
    subtext: "250 to Silver II",
    icon: Star,
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
  },
];

const donationHistory = [
  { id: "1", date: "Jan 12, 2026", type: "Whole Blood", location: "Central Hospital", status: "Completed" },
  { id: "2", date: "Oct 05, 2025", type: "Plasma", location: "Red Cross Center", status: "Completed" },
  { id: "3", date: "Jul 20, 2025", type: "Whole Blood", location: "Community Drive", status: "Completed" },
  { id: "4", date: "Apr 15, 2025", type: "Whole Blood", location: "Central Hospital", status: "Completed" },
];

const achievements = [
  { name: "First Timer", icon: Trophy, description: "Your first life-saving donation", earned: true },
  { name: "Regular Donor", icon: Award, description: "Donated 5 times in a year", earned: true },
  { name: "Life Saver", icon: Heart, description: "Saved more than 30 lives", earned: true },
  { name: "Silver Hero", icon: Star, description: "Reach 1,000 loyalty points", earned: true },
  { name: "Gallon Club", icon: Droplet, description: "Donate 1 gallon of blood", earned: false },
  { name: "Champion", icon: Flame, description: "10 consecutive donations", earned: false },
];

const upcomingCampaigns = [
  { title: "Summer Blood Drive 2026", date: "June 20, 2026", location: "City Park", registered: true },
  { title: "Emergency Plasma Call", date: "May 15, 2026", location: "Metro Clinic", registered: false },
];

const motivationalQuotes = [
  "Every drop you give is a heartbeat you save.",
  "Heroes don't always wear capes — some roll up their sleeves.",
  "You are someone's miracle. Keep donating!",
];

/* ------------------------------------------------------------------ */
/*  Progress Ring — SVG circle for visual impact                       */
/* ------------------------------------------------------------------ */

function ProgressRing({ progress, size = 80, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-secondary"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.62 0.16 18)" />
          <stop offset="100%" stopColor="oklch(0.5 0.22 25)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Component                                                */
/* ------------------------------------------------------------------ */

export default function DonorDashboard() {
  const randomQuote = motivationalQuotes[1]; // static for SSR consistency

  return (
    <div className="space-y-6 pb-16">

      {/* ──────────────────── WELCOME HERO ──────────────────── */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-red-600 to-rose-700 p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-red-200/40">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left — greeting */}
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm text-xs font-semibold">
                <Flame className="w-3 h-3 mr-1" /> Level 4 · Life Saver
              </Badge>
              <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm text-xs font-semibold">
                🔥 8 donation streak
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Welcome back, John! 👋
            </h1>
            <p className="text-rose-100/90 text-sm sm:text-base leading-relaxed">
              Your last donation was <span className="font-semibold text-white">4 months ago</span>.
              You&apos;ve saved an estimated <span className="font-semibold text-white">36 lives</span> — keep the momentum going!
            </p>
            <p className="text-rose-200/70 text-xs italic">&ldquo;{randomQuote}&rdquo;</p>
          </div>

          {/* Right — eligibility card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 sm:p-6 border border-white/20 flex flex-col items-center text-center min-w-[200px] shrink-0">
            <div className="relative flex items-center justify-center mb-3">
              <ProgressRing progress={65} size={88} strokeWidth={5} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[22px] font-black leading-none">45</span>
                <span className="text-[10px] font-medium opacity-80 uppercase tracking-wide">days</span>
              </div>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-widest opacity-70 mb-0.5">Next Eligibility</p>
            <p className="text-xl font-bold">June 15, 2026</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 bg-white text-rose-600 hover:bg-rose-50 font-semibold shadow-lg shadow-black/10 w-full"
            >
              Schedule Donation
            </Button>
          </div>
        </div>

        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-80 h-80 bg-white/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-56 h-56 bg-red-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-pink-300/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* ──────────────────── STATS GRID ──────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden relative"
          >
            {/* Subtle top accent bar */}
            <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <CardContent className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
              <div className={`${stat.bgLight} ${stat.textColor} p-2.5 sm:p-3 rounded-xl shrink-0`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{stat.label}</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-0.5">{stat.value}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
                  {stat.subtext}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ──────────────────── MAIN CONTENT GRID ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">

        {/* Left Column — 3/5 */}
        <div className="lg:col-span-3 space-y-5 lg:space-y-6">

          {/* Donation History */}
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg sm:text-xl">Donation History</CardTitle>
                <CardDescription className="mt-1">Your recent contributions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5 text-xs sm:text-sm">
                View All <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
              </Button>
            </CardHeader>
            <CardContent>
              {/* Desktop table */}
              <div className="hidden sm:block relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] text-muted-foreground uppercase bg-secondary/30">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-l-lg">Date</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Location</th>
                      <th className="px-4 py-3 font-semibold rounded-r-lg text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {donationHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/10 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-sm">{item.date}</td>
                        <td className="px-4 py-3.5 text-sm">{item.type}</td>
                        <td className="px-4 py-3.5 text-muted-foreground text-sm flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 shrink-0 opacity-50" />
                          {item.location}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[11px]">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="sm:hidden space-y-3">
                {donationHistory.map((item) => (
                  <div key={item.id} className="bg-secondary/20 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{item.date}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.type}</p>
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" /> {item.location}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Campaigns */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <Megaphone className="w-4 h-4 text-primary" />
                </div>
                Upcoming Campaigns
              </h2>
              <Button variant="ghost" size="sm" className="text-xs text-primary hover:bg-primary/5">
                See All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {upcomingCampaigns.map((camp, i) => (
                <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className="h-1.5 w-full bg-gradient-to-r from-primary/20 to-primary/5 group-hover:from-primary group-hover:to-primary/60 transition-all duration-300" />
                  <CardContent className="p-4 sm:p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1.5 min-w-0">
                        <h4 className="font-bold text-sm sm:text-base leading-snug">{camp.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-primary/60" /> {camp.date}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/60" /> {camp.location}
                        </div>
                      </div>
                      {camp.registered && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none shrink-0 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Registered
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant={camp.registered ? "outline" : "default"}
                      className="w-full text-xs h-9"
                    >
                      {camp.registered ? "View Details" : "Register Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Impact Milestone Tracker */}
          <Card className="border-none shadow-sm bg-gradient-to-br from-card to-secondary/20 overflow-hidden">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-amber-100 text-amber-600 p-1.5 rounded-lg">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Next Milestone: Silver Hero II</h3>
                  <p className="text-xs text-muted-foreground">250 more points to unlock exclusive rewards</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Progress</span>
                  <span className="font-bold text-foreground">1,250 / 1,500 pts</span>
                </div>
                <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 transition-all duration-700 ease-out relative"
                    style={{ width: "83%" }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground/60">
                  <span>Silver I ✓</span>
                  <span>Silver II</span>
                  <span>Gold I</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column — 2/5 */}
        <div className="lg:col-span-2 space-y-5 lg:space-y-6">

          {/* Upcoming Appointment */}
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-rose-500 to-red-600" />
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <div className="bg-rose-50 text-rose-500 p-1.5 rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
                Upcoming Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Whole Blood</span>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]" variant="outline">
                    Confirmed
                  </Badge>
                </div>
                <div className="space-y-0.5">
                  <p className="text-base sm:text-lg font-bold">Friday, May 08</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">09:30 AM – 10:00 AM</p>
                </div>
                <div className="pt-2.5 border-t border-border/40">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Location</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                    St. Mary&apos;s Blood Bank, Wing A
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  Reschedule
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive text-xs">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <div className="bg-amber-50 text-amber-500 p-1.5 rounded-lg">
                    <Award className="w-4 h-4" />
                  </div>
                  Achievements
                </CardTitle>
                <Badge variant="secondary" className="text-[10px] font-bold">
                  4 / 6
                </Badge>
              </div>
              <CardDescription className="mt-1">Badges you&apos;ve unlocked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {achievements.map((ach, i) => (
                  <div
                    key={i}
                    className={`relative group cursor-help transition-all duration-200 rounded-xl p-3 sm:p-4 flex flex-col items-center text-center gap-1.5 ${
                      ach.earned
                        ? "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 hover:shadow-md hover:-translate-y-0.5"
                        : "bg-secondary/40 text-muted-foreground/40"
                    }`}
                    title={ach.description}
                  >
                    <ach.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className={`text-[9px] sm:text-[10px] font-semibold leading-tight ${ach.earned ? "text-amber-700" : "text-muted-foreground/50"}`}>
                      {ach.name}
                    </span>
                    {ach.earned && (
                      <span className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      </span>
                    )}
                    {!ach.earned && (
                      <span className="absolute inset-0 flex items-center justify-center bg-card/60 backdrop-blur-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-bold text-muted-foreground px-2">Locked</span>
                      </span>
                    )}
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-28 sm:w-32 p-2 bg-slate-800 text-white text-[9px] sm:text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-lg z-10">
                      <p className="font-bold mb-0.5">{ach.name}</p>
                      {ach.description}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4 text-xs text-primary">
                View All Achievements
              </Button>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Recent Updates</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {[
                  { title: "Appointment Confirmed", time: "2 hours ago", icon: CheckCircle2, color: "text-emerald-500", bgColor: "bg-emerald-50" },
                  { title: "New Campaign near you", time: "Yesterday", icon: Megaphone, color: "text-blue-500", bgColor: "bg-blue-50" },
                  { title: "Points Earned! +50", time: "2 days ago", icon: Star, color: "text-amber-500", bgColor: "bg-amber-50" },
                ].map((note, i) => (
                  <div key={i} className="flex gap-3 px-6 py-3.5 hover:bg-secondary/15 transition-colors cursor-pointer group">
                    <div className={`${note.bgColor} ${note.color} p-1.5 rounded-lg shrink-0 h-fit`}>
                      <note.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{note.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{note.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0 self-center group-hover:text-primary/50 transition-colors" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
