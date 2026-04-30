"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Users, Droplets, Activity, Heart } from "lucide-react";
import { useRef } from "react";

const stats = [
  { label: "Registered Donors", value: 12500, icon: Users, suffix: "+" },
  { label: "Blood Units Collected", value: 8400, icon: Droplets, suffix: "+" },
  { label: "Emergency Requests Fulfilled", value: 3200, icon: Activity, suffix: "+" },
  { label: "Lives Saved", value: 25000, icon: Heart, suffix: "+" },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let startTimestamp: number;
      const duration = 2000; // 2 seconds

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(value);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, value]);

  return (
    <span ref={nodeRef}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function ImpactStats() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-red-500/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-50"></div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-red-500/20"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={28} strokeWidth={2} />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </h3>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
