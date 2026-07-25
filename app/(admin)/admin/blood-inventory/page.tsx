"use client";

import { 
  Droplet, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp,
  Hospital
} from "lucide-react";
import { cn } from "@/lib/utils";

const INVENTORY_ITEMS = [
  { id: "inv-1", bloodGroup: "O+", component: "Whole Blood", unitsAvailable: 85, unitsReserved: 12, expiry: "2026-08-15", status: "Adequate", hospital: "Shambu General Hospital" },
  { id: "inv-2", bloodGroup: "A+", component: "Packed Red Cells", unitsAvailable: 64, unitsReserved: 8, expiry: "2026-08-10", status: "Adequate", hospital: "Shambu General Hospital" },
  { id: "inv-3", bloodGroup: "B+", component: "Platelets", unitsAvailable: 42, unitsReserved: 15, expiry: "2026-07-30", status: "Moderate", hospital: "Fincha Valley Hospital" },
  { id: "inv-4", bloodGroup: "O-", component: "Whole Blood", unitsAvailable: 9, unitsReserved: 6, expiry: "2026-08-02", status: "Critical Shortage", hospital: "Shambu General Hospital" },
  { id: "inv-5", bloodGroup: "A-", component: "Plasma", unitsAvailable: 14, unitsReserved: 2, expiry: "2026-09-01", status: "Low", hospital: "Nekemte Referral Hospital" },
  { id: "inv-6", bloodGroup: "AB+", component: "Whole Blood", unitsAvailable: 28, unitsReserved: 4, expiry: "2026-08-20", status: "Adequate", hospital: "Shambu General Hospital" },
  { id: "inv-7", bloodGroup: "B-", component: "Cryoprecipitate", unitsAvailable: 6, unitsReserved: 4, expiry: "2026-08-05", status: "Critical Shortage", hospital: "Shambu General Hospital" },
  { id: "inv-8", bloodGroup: "AB-", component: "Plasma", unitsAvailable: 11, unitsReserved: 1, expiry: "2026-09-12", status: "Low", hospital: "Fincha Valley Hospital" },
];

export default function AdminBloodInventoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Blood Inventory Management</h1>
          <p className="text-muted-foreground font-medium">Monitor blood units, component reserves, expiry dates, and shortage alerts.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Inventory Batch
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Available</span>
            <Droplet className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">259 Units</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14 units this week
          </p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reserved for Patients</span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">52 Units</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Pending emergency dispatch</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Critical Shortages</span>
            <ShieldAlert className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-destructive mt-2">2 Groups</p>
          <p className="text-xs text-destructive font-semibold mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> O- and B- below threshold
          </p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expiring in 7 Days</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">18 Units</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Platelet batches requiring usage</p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">Blood Stock Grid</h3>
          <span className="text-xs font-semibold text-muted-foreground">Showing 8 Active Stock Categories</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/40 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Component Type</th>
                <th className="px-6 py-4">Hospital / Storage</th>
                <th className="px-6 py-4">Available Units</th>
                <th className="px-6 py-4">Reserved</th>
                <th className="px-6 py-4">Earliest Expiry</th>
                <th className="px-6 py-4">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INVENTORY_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-primary text-base">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                      <Droplet className="w-4 h-4 fill-primary" /> {item.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {item.component}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Hospital className="w-3.5 h-3.5" /> {item.hospital}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-foreground">
                    {item.unitsAvailable} Units
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    {item.unitsReserved} Units
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    {item.expiry}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                      item.status === "Adequate" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                      item.status === "Moderate" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                      item.status === "Low" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                      "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    )}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
