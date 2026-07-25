"use client";

import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Droplet, 
  Calendar, 
  ShieldCheck, 
  Edit, 
  Award 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DonorProfilePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">My Donor Profile</h1>
          <p className="text-muted-foreground font-medium">Manage your personal blood donor profile and contact details.</p>
        </div>
        <Button variant="outline" className="font-bold gap-2">
          <Edit className="w-4 h-4" /> Edit Profile
        </Button>
      </div>

      {/* Main Info Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-rose-500/20 via-primary/10 to-card" />
        <CardContent className="p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-card border-4 border-background flex items-center justify-center text-primary font-bold text-2xl shadow-md">
                JD
              </div>
              <div className="mb-1">
                <h2 className="text-2xl font-bold text-foreground">John Donor</h2>
                <p className="text-xs text-muted-foreground font-medium">Member since November 2024</p>
              </div>
            </div>
            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border-rose-500/20 text-sm px-4 py-1.5 rounded-xl">
              Blood Type: O Positive (O+)
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/60">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">john.donor@example.com</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">+251 911 000 111</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">Shambu Town, Horo Guduru, Ethiopia</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Medical & Eligibility Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Donation Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Eligible Soon</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Next Eligible Date</span>
                  <span className="font-bold text-foreground">June 15, 2026</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Total Lifetime Contributions</span>
                  <span className="font-bold text-primary">12 Units</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
