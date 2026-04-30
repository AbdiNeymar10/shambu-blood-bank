"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeartHandshake } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="container px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm">
            <HeartHandshake className="w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Take the Pledge Today</h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Join thousands of others in our registry. You don't have to donate today—just register your willingness to be called upon when your community needs you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg h-14 px-8">
              Register as a Donor
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-lg h-14 px-8">
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
