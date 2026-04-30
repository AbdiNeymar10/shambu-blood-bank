"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, FileCheck, Stethoscope } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "AABB Accredited",
    desc: "Meeting strict standards for blood banking."
  },
  {
    icon: Award,
    title: "ISO 9001:2015",
    desc: "Certified quality management system."
  },
  {
    icon: FileCheck,
    title: "FDA Registered",
    desc: "Fully compliant with federal regulations."
  },
  {
    icon: Stethoscope,
    title: "Medical Board Approved",
    desc: "Endorsed by regional health authorities."
  }
];

export function TrustBadges() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-1">{badge.title}</h4>
                <p className="text-primary-foreground/80 text-sm max-w-[200px]">{badge.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
