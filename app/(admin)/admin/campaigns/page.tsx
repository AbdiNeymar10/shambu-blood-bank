"use client";

import { 
  Megaphone, 
  MapPin, 
  Calendar, 
  Users, 
  Droplet, 
  Plus, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { cn } from "@/lib/utils";

const CAMPAIGNS = [
  { id: "camp-1", title: "Shambu High School Blood Drive 2026", location: "Shambu High School Campus Hall", startDate: "2026-08-01", endDate: "2026-08-03", targetUnits: 150, registeredDonors: 112, status: "Upcoming" },
  { id: "camp-2", title: "Fincha Valley Sugar Factory Outreach", location: "Fincha Recreation Club", startDate: "2026-07-20", endDate: "2026-07-28", targetUnits: 200, registeredDonors: 185, status: "Active" },
  { id: "camp-3", title: "World Blood Donor Day Shambu Rally", location: "Shambu Public Square", startDate: "2026-06-14", endDate: "2026-06-14", targetUnits: 300, registeredDonors: 310, status: "Completed" },
  { id: "camp-4", title: "Nekemte University Student Union Drive", location: "Health Sciences Campus", startDate: "2026-08-15", endDate: "2026-08-18", targetUnits: 250, registeredDonors: 78, status: "Upcoming" },
];

export default function AdminCampaignsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Blood Donation Campaigns</h1>
          <p className="text-muted-foreground font-medium">Organize blood drives, track volunteer registrations, and measure campaign impact.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Create New Campaign
        </button>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CAMPAIGNS.map((camp) => {
          const progress = Math.min(100, Math.round((camp.registeredDonors / camp.targetUnits) * 100));
          return (
            <div key={camp.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                  camp.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                  camp.status === "Upcoming" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                  "bg-secondary text-muted-foreground"
                )}>
                  {camp.status === "Active" ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {camp.status}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">Target: {camp.targetUnits} Units</span>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{camp.title}</h3>

              <div className="space-y-1.5 text-xs text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{camp.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{camp.startDate} to {camp.endDate}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-4 border-t border-border">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{camp.registeredDonors} Registered Volunteers</span>
                  <span className="text-primary font-bold">{progress}% Goal</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-4 pt-3 flex justify-end gap-2">
                <button className="text-xs font-bold text-primary hover:underline">
                  Manage Registrations & Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
