"use client";

import { motion } from "framer-motion";
import { HeartPulse, Droplets, Activity, Users } from "lucide-react";

const benefits = [
  {
    icon: Droplets,
    title: "Save Up to 3 Lives",
    desc: "A single donation can be separated into red cells, platelets, and plasma."
  },
  {
    icon: HeartPulse,
    title: "Improve Heart Health",
    desc: "Regular donation may lower the risk of heart attacks and balance iron levels."
  },
  {
    icon: Activity,
    title: "Free Health Check",
    desc: "Every donation includes a mini-physical, checking your pulse, blood pressure, and hemoglobin."
  },
  {
    icon: Users,
    title: "Community Impact",
    desc: "Your donation directly helps accident victims, surgery patients, and those with chronic illnesses."
  }
];

export function WhyDonate() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Donate Blood?</h2>
          <p className="text-muted-foreground text-lg">
            Giving blood is a simple, safe process that takes just a little of your time, but makes a lifetime of difference for someone in need.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
