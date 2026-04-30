"use client";

import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-red-600 border border-red-500 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-red-500 to-red-700 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-80" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-700/50 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

          <div className="relative z-10 px-8 py-16 md:py-24 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
              >
                Ready to Be a Hero?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-red-100 max-w-xl mx-auto lg:mx-0"
              >
                Your single blood donation can save up to three lives. Join our community of lifesavers today.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0"
            >
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-red-600 hover:bg-red-50 rounded-full shadow-lg transition-all hover:scale-105">
                Become a Donor
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10 rounded-full backdrop-blur-sm transition-all hover:scale-105">
                <PhoneCall className="mr-2 w-5 h-5" />
                Emergency Request
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
