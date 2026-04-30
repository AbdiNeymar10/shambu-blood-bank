"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export function Eligibility() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border/50">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Are you eligible to donate?</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Most healthy adults can donate blood. To ensure the safety of both donors and recipients, there are some basic requirements you must meet before donating.
            </p>

            <div className="space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-green-500 w-6 h-6" />
                  Basic Requirements
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Be in good general health and feeling well.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Be at least 17 years old (16 with parental consent in some areas).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Weigh at least 110 lbs (50 kg).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Have not donated blood in the last 56 days.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <XCircle className="text-destructive w-6 h-6" />
                  Temporary Deferrals
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <span>Cold, flu, or COVID-19 symptoms.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <span>Recent tattoos or piercings (varies by state laws).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <span>Travel to certain malaria-endemic areas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <span>Taking specific medications (antibiotics, blood thinners).</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=1600&auto=format&fit=crop" 
                alt="Blood donation eligibility check" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-card border border-border p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">Tip</span>
                </div>
                <h4 className="font-bold">Preparation</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Drink an extra 16 oz. of water and eat a healthy, iron-rich meal before your donation.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
