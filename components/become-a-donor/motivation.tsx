"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function Motivation() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">More Than Just a Donation</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                When you become a registered donor, you're doing more than giving blood. You are making a solemn pledge to be there for your community when they need you most.
              </p>
              <p>
                As a registered donor, you'll receive updates on your blood's journey, priority booking for donation appointments, and alerts when your specific blood type is urgently needed in your area.
              </p>
            </div>

            <div className="mt-10 p-8 bg-muted rounded-2xl relative">
              <Quote className="w-10 h-10 text-primary/20 absolute top-4 left-4" />
              <blockquote className="relative z-10 text-xl font-medium italic text-foreground mb-4 pt-4 px-4">
                "I started donating in college just to help out. Ten years later, getting the notification that my donation saved a little girl's life made it the most fulfilling thing I've ever done."
              </blockquote>
              <div className="flex items-center gap-4 px-4">
                <div className="w-12 h-12 rounded-full bg-primary overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Donor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold">David Miller</div>
                  <div className="text-sm text-primary">Gold Tier Donor (20+ Donations)</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=800&auto=format&fit=crop" alt="Happy donor" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-primary text-primary-foreground p-6 flex flex-col justify-center">
                <div className="text-4xl font-display font-bold mb-2">1 in 3</div>
                <div className="text-sm opacity-90">people will need blood at some point in their lifetime.</div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-accent-crimson text-white p-6 flex flex-col justify-center">
                <div className="text-4xl font-display font-bold mb-2">Every 2s</div>
                <div className="text-sm opacity-90">someone in our country needs a blood transfusion.</div>
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop" alt="Medical staff" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
