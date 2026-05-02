"use client";

import { motion } from "framer-motion";
import { UserPlus, ClipboardCheck, Droplet, FlaskConical, Snowflake, HeartPulse } from "lucide-react";
import { Container, SectionHeader } from "@/components/shared";
import { fadeInUp, viewportOnce } from "@/lib/motion";

const steps = [
  { icon: UserPlus, title: "Register", description: "Sign up online or at our facility. We'll collect your basic details to create your donor profile." },
  { icon: ClipboardCheck, title: "Health Screening", description: "A quick, confidential mini-physical and health history review to ensure you're fit to donate." },
  { icon: Droplet, title: "Donate Blood", description: "The actual donation takes about 10 minutes. Relax while our skilled phlebotomists take care of you." },
  { icon: FlaskConical, title: "Lab Testing", description: "Your blood is sent to our state-of-the-art lab for blood typing and infectious disease testing." },
  { icon: Snowflake, title: "Storage & Matching", description: "Safe components are stored in temperature-controlled environments, ready to be matched." },
  { icon: HeartPulse, title: "Save Lives", description: "Your blood is distributed to local hospitals, directly helping patients in need of transfusions." },
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <Container className="relative z-10">
        <SectionHeader
          align="center"
          eyebrow="The Journey"
          eyebrowColor="red"
          title="How Donation Works"
          description="The process of donating blood is simple, safe, and takes very little time. Follow the journey of your blood from donation to saving a life."
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-border via-red-300/40 to-border -translate-y-1/2" />
          
          {/* Connector Line (Mobile) */}
          <div className="block lg:hidden absolute top-0 bottom-0 left-8 w-[2px] bg-gradient-to-b from-border via-red-300/40 to-border" />

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={fadeInUp}
                  custom={index}
                  className="relative flex lg:flex-col items-start lg:items-center gap-5 lg:gap-4"
                >
                  {/* Circle */}
                  <div className="relative shrink-0 w-16 h-16 rounded-full bg-card border-[3px] border-background shadow-md flex items-center justify-center z-10 transition-transform duration-300 hover:scale-110 hover:border-red-500/30 group">
                    <div className="absolute inset-0 bg-red-500/8 rounded-full" />
                    <Icon className="text-red-500 relative z-10" size={22} />
                    
                    {/* Number Badge */}
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:text-center pt-1 lg:pt-3 flex-1">
                    <h3 className="text-base font-bold mb-1.5">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
