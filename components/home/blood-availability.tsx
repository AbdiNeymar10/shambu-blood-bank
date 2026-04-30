"use client";

import { motion } from "framer-motion";
import { Droplet, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type BloodStatus = "Available" | "Low" | "Critical";

interface BloodGroup {
  type: string;
  stock: number;
  status: BloodStatus;
}

const bloodInventory: BloodGroup[] = [
  { type: "A+", stock: 85, status: "Available" },
  { type: "A-", stock: 12, status: "Low" },
  { type: "B+", stock: 65, status: "Available" },
  { type: "B-", stock: 4, status: "Critical" },
  { type: "AB+", stock: 42, status: "Available" },
  { type: "AB-", stock: 2, status: "Critical" },
  { type: "O+", stock: 95, status: "Available" },
  { type: "O-", stock: 8, status: "Low" },
];

const statusConfig = {
  Available: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle },
  Low: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Info },
  Critical: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: AlertTriangle },
};

export function BloodAvailability() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-red-500/10 text-red-600 font-medium text-sm mb-6"
          >
            <Droplet size={16} className="mr-2" />
            Live Inventory
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            Real-Time Blood Availability
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Check our current stock levels. If your blood type is marked as Low or Critical, your donation is urgently needed today.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bloodInventory.map((item, index) => {
            const config = statusConfig[item.status];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "relative overflow-hidden rounded-3xl p-6 border bg-card transition-all duration-300 hover:shadow-lg",
                  "hover:-translate-y-1",
                  config.border
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-2xl shadow-lg shadow-red-500/30">
                    {item.type}
                  </div>
                  <div className={cn("px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5", config.bg, config.color)}>
                    <StatusIcon size={14} />
                    {item.status}
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-muted-foreground font-medium">Stock Level</span>
                    <span className="text-2xl font-bold">{item.stock}<span className="text-sm text-muted-foreground font-normal ml-1">units</span></span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min((item.stock / 100) * 100, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full", item.status === "Available" ? "bg-emerald-500" : item.status === "Low" ? "bg-amber-500" : "bg-red-500")}
                    />
                  </div>
                </div>
                
                {item.status === "Critical" && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-[100px] -z-10" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
