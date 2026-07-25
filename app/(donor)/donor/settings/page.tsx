"use client";

import { 
  Settings, 
  Bell, 
  Lock, 
  Eye, 
  Save 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DonorSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Account & Preferences</h1>
        <p className="text-muted-foreground font-medium">Manage notification settings, security options, and donor profile visibility.</p>
      </div>

      {/* Security Preferences */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" /> Security & Password
          </CardTitle>
          <CardDescription>Update your login credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Preferences */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Communication Preferences
          </CardTitle>
          <CardDescription>Choose how you receive emergency shortage alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <div>
              <p className="font-semibold text-sm text-foreground">SMS Emergency Shortage Alerts</p>
              <p className="text-xs text-muted-foreground">Receive instant SMS text messages during critical blood shortages</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle rounded accent-primary w-5 h-5" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold text-sm text-foreground">Email Appointment Reminders</p>
              <p className="text-xs text-muted-foreground">Receive confirmation and reminder emails for upcoming donations</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle rounded accent-primary w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Button className="font-bold gap-2">
          <Save className="w-4 h-4" /> Save Preferences
        </Button>
      </div>
    </div>
  );
}
