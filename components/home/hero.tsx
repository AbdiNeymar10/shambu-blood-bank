"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ShieldCheck, Activity, Users, Droplet } from "lucide-react";
import { HeroScene } from "./hero-scene";

const badges = [
  { icon: Clock, text: "24/7 Emergency Support" },
  { icon: ShieldCheck, text: "Verified Donors" },
  { icon: Activity, text: "Fast Blood Matching" },
  { icon: Users, text: "Community Impact" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

export function Hero() {
  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center overflow-hidden">
      <HeroScene />
      
      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center mt-12"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="flex items-center">
                <span className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                Save a Life Today
              </span>
            </Badge>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground mb-6"
          >
            Every Drop <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 relative whitespace-nowrap">
              Saves a Life
              <Droplet className="absolute -top-6 -right-8 w-8 h-8 text-red-500 rotate-12 opacity-80 hidden md:block" />
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
          >
            Join our mission to provide safe blood donation and critical emergency support. Your contribution can be the lifeline someone desperately needs right now.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mb-20">
            <Button size="lg" className="h-14 px-8 text-lg bg-red-600 hover:bg-red-700 text-white rounded-full shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all hover:scale-105 active:scale-95 border border-red-500/50">
              Donate Now
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full backdrop-blur-md bg-background/50 border-border/50 hover:bg-accent/50 transition-all hover:scale-105 active:scale-95">
              Request Blood
            </Button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="w-full pt-10 border-t border-border/30 relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
              {badges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-background/60 backdrop-blur-md border border-border/40 shadow-sm hover:shadow-red-500/10 hover:border-red-500/30 transition-colors"
                  >
                    <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <span className="font-medium text-sm md:text-base text-foreground/80">{badge.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
