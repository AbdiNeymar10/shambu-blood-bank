"use client";

import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  Bell, 
  Smartphone, 
  Save, 
  UserCheck 
} from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">System Settings</h1>
        <p className="text-muted-foreground font-medium">Configure organization details, SMS notification gateways, and admin security settings.</p>
      </div>

      {/* Organization Details Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" /> Organization Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Blood Bank Name</label>
            <input 
              type="text" 
              defaultValue="Shambu Blood Bank & Regional Distribution Center" 
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Emergency Hotline Phone</label>
            <input 
              type="text" 
              defaultValue="+251 57 665 0123" 
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Primary Contact Email</label>
            <input 
              type="email" 
              defaultValue="support@shambu-bloodbank.org" 
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Location / Address</label>
            <input 
              type="text" 
              defaultValue="Shambu Town, Horo Guduru Wollega, Oromia, Ethiopia" 
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* SMS Gateway & Notifications Configuration */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" /> SMS Gateway & Emergency Broadcast Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">SMS Provider</label>
            <select className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Ethio Telecom Bulk SMS API</option>
              <option>Twilio SMS Gateway</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Sender ID</label>
            <input 
              type="text" 
              defaultValue="SHAMBU-BLOOD" 
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end pt-2">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
          <Save className="w-4 h-4" /> Save System Settings
        </button>
      </div>
    </div>
  );
}
