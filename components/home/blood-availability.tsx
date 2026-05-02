"use client";

import { motion } from "framer-motion";
import { Droplet, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, SectionHeader } from "@/components/shared";
import { staggerContainerFast, fadeInUp, viewportOnce } from "@/lib/motion";

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
    <section className="section-padding bg-muted/30">
      <Container>
        <SectionHeader
          align="center"
          eyebrow="Live Inventory"
          eyebrowIcon={<Droplet size={16} />}
          eyebrowColor="red"
          title="Real-Time Blood Availability"
          description="Check our current stock levels. If your blood type is marked as Low or Critical, your donation is urgently needed today."
        />

        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {bloodInventory.map((item) => {
            const config = statusConfig[item.status];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={item.type}
                variants={fadeInUp}
                className={cn(
                  "relative overflow-hidden rounded-2xl p-5 md:p-6 border bg-card transition-all duration-300 hover:shadow-lg",
                  "hover:-translate-y-1",
                  config.border
                )}
              >
                <div className="flex justify-between items-start mb-5 md:mb-6">
                  <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-lg md:text-xl shadow-lg shadow-red-500/25">
                    {item.type}
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold flex items-center gap-1",
                    config.bg,
                    config.color,
                    item.status === "Critical" && "animate-[pulse-subtle_2s_ease-in-out_infinite]"
                  )}>
                    <StatusIcon size={12} />
                    {item.status}
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-muted-foreground font-medium">Stock Level</span>
                    <span className="text-xl md:text-2xl font-bold">{item.stock}<span className="text-xs text-muted-foreground font-normal ml-1">units</span></span>
                  </div>
                  <div
                    className="w-full h-1.5 md:h-2 rounded-full bg-muted overflow-hidden"
                    role="progressbar"
                    aria-valuenow={item.stock}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${item.type} stock level: ${item.stock} units, ${item.status}`}
                  >
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(item.stock, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full", item.status === "Available" ? "bg-emerald-500" : item.status === "Low" ? "bg-amber-500" : "bg-red-500")}
                    />
                  </div>
                </div>
                
                {item.status === "Critical" && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/8 rounded-bl-[80px] pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
