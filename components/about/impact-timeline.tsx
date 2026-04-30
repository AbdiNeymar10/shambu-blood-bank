"use client";

import { motion } from "framer-motion";

const timelineEvents = [
  {
    year: "2008",
    title: "Foundation Established",
    description: "Started with a single collection center and a passionate team of 5 volunteers.",
  },
  {
    year: "2012",
    title: "Regional Expansion",
    description: "Opened 3 new centers across the state, increasing daily collection capacity by 300%.",
  },
  {
    year: "2015",
    title: "Advanced Tech Adoption",
    description: "Implemented state-of-the-art NAT testing to ensure the highest safety standards for all blood products.",
  },
  {
    year: "2019",
    title: "Mobile App Launch",
    description: "Introduced our donor mobile application, making it easier to schedule appointments and track donations.",
  },
  {
    year: "2023",
    title: "National Recognition",
    description: "Awarded the National Healthcare Excellence Award for our critical response during emergencies.",
  },
];

export function ImpactTimeline() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Journey</h2>
          <p className="text-muted-foreground text-lg">
            A timeline of our growth, milestones, and the impact we've made together over the years.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-border/60 hidden md:block" />

          <div className="space-y-12">
            {timelineEvents.map((event, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Center Dot */}
                  <div className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block z-10" />
                  
                  {/* Content Box */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'} w-full relative`}
                  >
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow relative">
                      {/* Mobile line connecting to top */}
                      <div className="absolute left-6 top-0 bottom-full w-px bg-border/60 md:hidden" />
                      
                      <div className="text-primary font-display font-bold text-2xl mb-2">{event.year}</div>
                      <h4 className="text-xl font-semibold mb-2">{event.title}</h4>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
