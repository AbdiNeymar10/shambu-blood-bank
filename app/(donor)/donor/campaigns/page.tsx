"use client";

import { 
  Megaphone, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Plus 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CAMPAIGNS = [
  { id: "c-1", title: "Fincha Valley Sugar Factory Outreach Drive", location: "Fincha Recreation Club Hall", dates: "July 20 – 28, 2026", target: "200 Units", registered: "185 Donors", status: "Active" },
  { id: "c-2", title: "Shambu High School Youth Blood Drive", location: "Shambu High School Assembly Hall", dates: "August 01 – 03, 2026", target: "150 Units", registered: "112 Donors", status: "Upcoming" },
  { id: "c-3", title: "Nekemte Health Sciences Campus Rally", location: "Nekemte Campus Main Pavilion", dates: "August 15 – 18, 2026", target: "250 Units", registered: "78 Donors", status: "Upcoming" },
];

export default function DonorCampaignsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Blood Drives & Campaigns</h1>
        <p className="text-muted-foreground font-medium">Explore upcoming community blood donation campaigns near Shambu and register to donate.</p>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CAMPAIGNS.map((camp) => (
          <Card key={camp.id} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={camp.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none font-bold"}>
                  {camp.status} Campaign
                </Badge>
                <span className="text-xs text-muted-foreground font-semibold">Goal: {camp.target}</span>
              </div>
              <CardTitle className="text-xl font-bold">{camp.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">{camp.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">{camp.dates}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">{camp.registered} Registered</span>
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full font-bold">
                  Register for Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
