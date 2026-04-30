"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Users, Database, CalendarHeart, HandHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Screened Blood",
    description: "Every drop undergoes rigorous FDA-approved testing for infectious diseases to ensure absolute patient safety.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Rapid Emergency Support",
    description: "Our dedicated emergency response team ensures critical blood units reach hospitals within 45 minutes of a request.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Users,
    title: "Trusted Donor Network",
    description: "A community of over 10,000 verified, regular donors who are ready to step up when their specific blood type is needed.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Database,
    title: "Real-Time Inventory",
    description: "Our state-of-the-art digital tracking system prevents shortages and minimizes waste by optimizing blood distribution.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: CalendarHeart,
    title: "Community Blood Drives",
    description: "We partner with local businesses, schools, and organizations to host mobile blood drives, making donation accessible.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: HandHeart,
    title: "Easy Online Requests",
    description: "Hospitals and patients can seamlessly request blood through our secure portal, tracking the delivery status in real-time.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
];

export function WhyChooseUs() {
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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
          >
            Why Choose Us
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            Setting the Standard in Blood Banking
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            We combine cutting-edge medical technology with compassionate care to ensure a seamless, safe, and efficient blood supply chain.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-8 rounded-3xl border border-border/50 bg-card hover:bg-muted/50 transition-colors duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10"></div>
                <div className={cn("inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6", feature.bg, feature.color)}>
                  <Icon size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
