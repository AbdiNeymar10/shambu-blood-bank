"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Users, Database, CalendarHeart, HandHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, SectionHeader } from "@/components/shared";
import { staggerContainer, fadeInUp, viewportOnce } from "@/lib/motion";

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
  return (
    <section className="section-padding bg-background">
      <Container>
        <SectionHeader
          align="center"
          eyebrow="Why Choose Us"
          eyebrowColor="primary"
          title="Setting the Standard in Blood Banking"
          description="We combine cutting-edge medical technology with compassionate care to ensure a seamless, safe, and efficient blood supply chain."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative p-7 md:p-8 rounded-2xl border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -mr-14 -mt-14 transition-all group-hover:from-primary/10 pointer-events-none" />
                <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5", feature.bg, feature.color)}>
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold mb-2.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
