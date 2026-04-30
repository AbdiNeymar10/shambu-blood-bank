"use client";

import { motion } from "framer-motion";
import { UserPlus, ClipboardCheck, Droplet, FlaskConical, Snowflake, HeartPulse } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description: "Sign up online or at our facility. We'll collect your basic details to create your donor profile.",
  },
  {
    icon: ClipboardCheck,
    title: "Health Screening",
    description: "A quick, confidential mini-physical and health history review to ensure you're fit to donate.",
  },
  {
    icon: Droplet,
    title: "Donate Blood",
    description: "The actual donation takes about 10 minutes. Relax while our skilled phlebotomists take care of you.",
  },
  {
    icon: FlaskConical,
    title: "Lab Testing",
    description: "Your blood is sent to our state-of-the-art lab for blood typing and infectious disease testing.",
  },
  {
    icon: Snowflake,
    title: "Storage & Matching",
    description: "Safe components are stored in temperature-controlled environments, ready to be matched.",
  },
  {
    icon: HeartPulse,
    title: "Save Lives",
    description: "Your blood is distributed to local hospitals, directly helping patients in need of transfusions.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-red-500/10 text-red-600 font-medium text-sm mb-6"
          >
            The Journey
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            How Donation Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            The process of donating blood is simple, safe, and takes very little time. Follow the journey of your blood from donation to saving a life.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2" />
          
          {/* Connector Line (Mobile) */}
          <div className="block lg:hidden absolute top-0 bottom-0 left-[31px] w-1 bg-border" />

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.15 }}
                  className="relative flex lg:flex-col items-start lg:items-center gap-6 lg:gap-4"
                >
                  {/* Circle */}
                  <div className="relative shrink-0 w-16 h-16 rounded-full bg-card border-4 border-background shadow-md flex items-center justify-center z-10 transition-transform hover:scale-110 hover:border-red-500/30">
                    <div className="absolute inset-0 bg-red-500/10 rounded-full" />
                    <Icon className="text-red-500 relative z-10" size={24} />
                    
                    {/* Number Badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:text-center pt-2 lg:pt-4 flex-1">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
