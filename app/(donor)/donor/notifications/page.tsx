"use client";

import { 
  Bell, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NOTIFICATIONS = [
  { id: "n-1", title: "Urgent: O+ Blood Needed at Shambu General", time: "2 hours ago", type: "Emergency Appeal", message: "Emergency shortage reported at Shambu General Hospital. If available, please visit for donation.", isNew: true },
  { id: "n-2", title: "Appointment Confirmation", time: "1 day ago", type: "Booking", message: "Your donation appointment for July 26, 2026 at 10:00 AM has been confirmed.", isNew: false },
  { id: "n-3", title: "Campaign Invitation: Fincha Drive", time: "3 days ago", type: "Campaign", message: "You're invited to join the upcoming Fincha Valley Blood Drive.", isNew: false },
];

export default function DonorNotificationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Notifications & Appeals</h1>
        <p className="text-muted-foreground font-medium">Stay updated on emergency blood appeals and appointment reminders.</p>
      </div>

      {/* List */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-border/60">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Notification Center
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border/60">
          {NOTIFICATIONS.map((item) => (
            <div key={item.id} className="p-5 flex items-start justify-between gap-4 hover:bg-secondary/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={item.type === "Emergency Appeal" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-none font-bold text-[10px]" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none font-bold text-[10px]"}>
                    {item.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.message}</p>
              </div>
              {item.isNew && (
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
