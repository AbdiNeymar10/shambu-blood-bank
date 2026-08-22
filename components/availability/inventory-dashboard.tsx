"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, TrendingDown, Loader2 } from "lucide-react";
import type { PublicBloodInventoryCard } from "@/lib/actions/inventory";

interface InventoryDashboardProps {
  items: PublicBloodInventoryCard[];
  isLoading: boolean;
}

const statusConfig = {
  safe: { color: "bg-green-500", text: "text-green-500", label: "Adequate Supply", icon: CheckCircle2 },
  low: { color: "bg-yellow-500", text: "text-yellow-500", label: "Low Inventory", icon: TrendingDown },
  critical: { color: "bg-destructive", text: "text-destructive", label: "Critical Shortage", icon: AlertCircle },
};

export function InventoryDashboard({ items, isLoading }: InventoryDashboardProps) {
  if (isLoading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
        <p className="text-sm font-medium">Checking live blood inventory...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center bg-card border border-border rounded-xl p-8">
        <p className="text-muted-foreground font-medium text-sm">No blood availability data found matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, idx) => {
        const config = statusConfig[item.status];
        const Icon = config.icon;

        return (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
          >
            {/* Background warning tint for critical */}
            {item.status === "critical" && (
              <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
            )}

            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-2xl">
                  {item.type}
                </div>
                <div className={`flex flex-col items-end gap-1 ${config.text}`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
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
            </div>

            {item.status !== "safe" ? (
              <div className="mt-4 pt-4 border-t border-border/50">
                <a 
                  href={`/donate?bloodGroup=${encodeURIComponent(item.type)}`} 
                  className={`text-sm font-medium hover:underline ${config.text}`}
                >
                  Donate {item.type} Blood &rarr;
                </a>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-border/50">
                <a 
                  href={`/donate?bloodGroup=${encodeURIComponent(item.type)}`} 
                  className="text-sm font-medium hover:underline text-muted-foreground"
                >
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
