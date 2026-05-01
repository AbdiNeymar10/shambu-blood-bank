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
  Users,
  Award,
  Zap,
  Megaphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock Data
const stats = [
  { label: "Total Donations", value: "12", icon: Droplet, color: "text-rose-500", bg: "bg-rose-50" },
  { label: "Lives Saved", value: "36", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  { label: "Blood Type", value: "O+", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Loyalty Points", value: "1,250", icon: Star, color: "text-blue-500", bg: "bg-blue-50" },
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
];

const upcomingCampaigns = [
  { title: "Summer Blood Drive 2026", date: "June 20, 2026", location: "City Park", registered: true },
  { title: "Emergency Plasma Call", date: "May 15, 2026", location: "Metro Clinic", registered: false },
];

export default function DonorDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 p-8 text-white shadow-xl shadow-red-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Welcome back, John! 👋</h1>
            <p className="text-rose-100 max-w-md">
              Your last donation was 4 months ago. You are making a huge difference in people's lives!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">Next Eligibility</p>
            <p className="text-3xl font-black">June 15</p>
            <p className="text-xs mt-1 font-medium italic">45 days to go</p>
            <Button variant="secondary" size="sm" className="mt-4 bg-white text-rose-600 hover:bg-rose-50">
              Schedule Now
            </Button>
          </div>
        </div>
        {/* Abstract backgrounds */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-red-400/20 rounded-full blur-2xl" />
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - History & Campaigns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Donation History */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-xl">Donation History</CardTitle>
                <CardDescription>Track your recent contributions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
                View All <ArrowUpRight className="ml-1 w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
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
                        <td className="px-4 py-4 font-medium">{item.date}</td>
                        <td className="px-4 py-4">{item.type}</td>
                        <td className="px-4 py-4 text-muted-foreground">{item.location}</td>
                        <td className="px-4 py-4 text-right">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" /> Upcoming Campaigns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingCampaigns.map((camp, i) => (
                <Card key={i} className="border-none shadow-sm overflow-hidden group">
                  <div className="h-2 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-bold">{camp.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <Calendar className="w-3 h-3" /> {camp.date}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <Clock className="w-3 h-3" /> {camp.location}
                        </div>
                      </div>
                      {camp.registered && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Registered</Badge>
                      )}
                    </div>
                    <Button variant={camp.registered ? "outline" : "default"} className="w-full text-xs h-9">
                      {camp.registered ? "View Details" : "Register Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Appointments & Achievements */}
        <div className="space-y-8">
          {/* Upcoming Appointment */}
          <Card className="border-none shadow-md bg-white border-l-4 border-l-rose-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" /> Upcoming Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/40 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Whole Blood</span>
                  <Badge className="bg-amber-500">Confirmed</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold">Friday, May 08</p>
                  <p className="text-sm text-muted-foreground">09:30 AM - 10:00 AM</p>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">St. Mary's Blood Bank, Wing A</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Reschedule</Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">Cancel</Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Achievements
              </CardTitle>
              <CardDescription>Badges you've unlocked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {achievements.map((ach, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-xl flex items-center justify-center relative group cursor-help transition-all ${ach.earned ? 'bg-amber-50 text-amber-600' : 'bg-secondary text-muted-foreground opacity-40'}`}
                    title={ach.description}
                  >
                    <ach.icon className="w-6 h-6" />
                    {ach.earned && (
                      <span className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      </span>
                    )}
                    {/* Tooltip emulation */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                      <p className="font-bold mb-0.5">{ach.name}</p>
                      {ach.description}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4 text-xs text-primary">View All Achievements</Button>
            </CardContent>
          </Card>

          {/* Quick Notifications */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Updates</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[
                  { title: "Appointment Confirmed", time: "2 hours ago", icon: CheckCircle2, color: "text-emerald-500" },
                  { title: "New Campaign near you", time: "Yesterday", icon: Megaphone, color: "text-blue-500" },
                  { title: "Points Earned! +50", time: "2 days ago", icon: Star, color: "text-amber-500" },
                ].map((note, i) => (
                  <div key={i} className="flex gap-3 p-4 hover:bg-secondary/20 transition-colors cursor-pointer">
                    <note.icon className={`w-5 h-5 shrink-0 ${note.color}`} />
                    <div>
                      <p className="text-sm font-medium leading-none">{note.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{note.time}</p>
                    </div>
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
