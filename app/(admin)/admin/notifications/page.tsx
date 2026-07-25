"use client";

import { 
  Bell, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Users, 
  Clock, 
  Filter 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  { id: "notif-1", title: "Emergency O- Negative Blood Shortage", type: "Emergency Alert", audience: "All Registered O- Donors in Shambu", date: "2026-07-25 10:15 AM", status: "Sent", delivered: 84 },
  { id: "notif-2", title: "Reminder: Fincha Valley Blood Drive Tomorrow", type: "Campaign Invite", audience: "Fincha Area Volunteers", date: "2026-07-24 04:30 PM", status: "Sent", delivered: 240 },
  { id: "notif-3", title: "Appointment Confirmation: Abebe Kebede", type: "Appointment", audience: "Specific Donor", date: "2026-07-24 01:00 PM", status: "Sent", delivered: 1 },
  { id: "notif-4", title: "Weekly Inventory Balance Digest", type: "System Alert", audience: "Admin & Staff Team", date: "2026-07-22 09:00 AM", status: "Sent", delivered: 6 },
];

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Notification & Alert Center</h1>
          <p className="text-muted-foreground font-medium">Broadcast emergency blood shortage appeals, SMS reminders, and system notifications.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto">
          <Send className="w-4 h-4" /> Send Emergency Broadcast
        </button>
      </div>

      {/* Broadcast Form Mockup Card */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" /> Create New Broadcast Alert
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Notification Title</label>
            <input 
              type="text" 
              placeholder="e.g. Urgent O+ Blood Appeal at Shambu General" 
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Target Audience</label>
            <select className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All Donors (Universal)</option>
              <option>O- Negative Donors Only</option>
              <option>A+ Positive Donors Only</option>
              <option>Shambu City Donors Only</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Message Content</label>
          <textarea 
            rows={3} 
            placeholder="Type emergency message details for SMS and Push notifications..." 
            className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex justify-end">
          <button className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl shadow-md">
            Dispatch Broadcast
          </button>
        </div>
      </div>

      {/* History Log */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent Sent Notifications</h3>
          <span className="text-xs font-semibold text-muted-foreground">Broadcast Log</span>
        </div>
        <div className="divide-y divide-border">
          {NOTIFICATIONS.map((notif) => (
            <div key={notif.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    notif.type === "Emergency Alert" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" :
                    notif.type === "Campaign Invite" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                    "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  )}>
                    {notif.type}
                  </span>
                  <span className="text-xs text-muted-foreground"><Clock className="w-3 h-3 inline" /> {notif.date}</span>
                </div>
                <h4 className="font-bold text-foreground text-sm">{notif.title}</h4>
                <p className="text-xs text-muted-foreground">Target: <Users className="w-3 h-3 inline" /> {notif.audience}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {notif.delivered} Delivered
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
