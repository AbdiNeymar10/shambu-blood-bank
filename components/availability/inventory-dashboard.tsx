"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, TrendingDown } from "lucide-react";

type BloodStatus = "safe" | "low" | "critical";

interface BloodInventory {
  type: string;
  percentage: number;
  status: BloodStatus;
}

const inventoryData: BloodInventory[] = [
  { type: "A+", percentage: 85, status: "safe" },
  { type: "A-", percentage: 30, status: "low" },
  { type: "B+", percentage: 65, status: "safe" },
  { type: "B-", percentage: 15, status: "critical" },
  { type: "AB+", percentage: 90, status: "safe" },
  { type: "AB-", percentage: 40, status: "low" },
  { type: "O+", percentage: 45, status: "low" },
  { type: "O-", percentage: 10, status: "critical" },
];

const statusConfig = {
  safe: { color: "bg-green-500", text: "text-green-500", label: "Adequate Supply", icon: CheckCircle2 },
  low: { color: "bg-yellow-500", text: "text-yellow-500", label: "Low Inventory", icon: TrendingDown },
  critical: { color: "bg-destructive", text: "text-destructive", label: "Critical Shortage", icon: AlertCircle },
};

export function InventoryDashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {inventoryData.map((item, idx) => {
        const config = statusConfig[item.status];
        const Icon = config.icon;

        return (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* Background warning tint for critical */}
            {item.status === "critical" && (
              <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
            )}

            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-2xl">
                {item.type}
              </div>
              <div className={`flex flex-col items-end gap-1 ${config.text}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{config.label}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Current Level</span>
                <span>{item.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 + (idx * 0.1) }}
                  className={`h-full rounded-full ${config.color}`} 
                />
              </div>
            </div>

            {item.status !== "safe" && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <a href="/donate" className={`text-sm font-medium hover:underline ${config.text}`}>
                  Donate {item.type} Blood &rarr;
                </a>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
