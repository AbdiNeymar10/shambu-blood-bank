"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Droplets, Activity, Heart } from "lucide-react";
import { Container } from "@/components/shared";
import { staggerContainer, fadeInUp, viewportOnce } from "@/lib/motion";

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
      const duration = 2000;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
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
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/8 via-transparent to-transparent opacity-60 pointer-events-none" />
      <Container className="relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative group p-7 md:p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-red-500/8 rounded-full blur-3xl -mr-14 -mt-14 transition-all group-hover:bg-red-500/15 pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-500 mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-1.5 tracking-tight">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
