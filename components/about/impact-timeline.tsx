"use client";

import { motion } from "framer-motion";

const timelineEvents = [
  {
    year: "June 28, 2017 E.C.",
    title: "Official Establishment",
    description: "Established by the Oromia Health Bureau to meet expanding healthcare demand and ensure safe blood products for all.",
  },
  {
    year: "Phase I",
    title: "Testing & Processing Facility",
    description: "Equipped state-of-the-art laboratory testing systems to guarantee high standards of safe red blood cells and tissue services.",
  },
  {
    year: "Phase II",
    title: "Voluntary Donor Network",
    description: "Mobilized community outreach programs encouraging regular voluntary blood donations every three months.",
  },
  {
    year: "Present",
    title: "Expanding Center of Excellence",
    description: "Striving towards becoming a regional and national Center of Excellence for blood and tissue services in Ethiopia.",
  },
];

export function ImpactTimeline() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Journey</h2>
          <p className="text-muted-foreground text-lg">
            Milestones and growth of Shambu Blood Bank since establishment by Oromia Health Bureau.
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
                      
                      <div className="text-primary font-display font-bold text-xl mb-2">{event.year}</div>
                      <h4 className="text-xl font-semibold mb-2">{event.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
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
