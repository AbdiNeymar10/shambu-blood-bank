"use client";

import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared";
import { fadeInUp, viewportOnce } from "@/lib/motion";

export function CtaBanner() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <Container>
        <div className="relative rounded-[2rem] overflow-hidden bg-red-600 border border-red-500 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-red-500 to-red-700 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-80 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-700/50 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          {/* CSS grid pattern instead of external texture URL */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

          <div className="relative z-10 px-6 py-14 sm:px-8 md:py-20 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center lg:text-left">
              <motion.h2 initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5">
                Ready to Be a Hero?
              </motion.h2>
              <motion.p initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="text-base md:text-lg text-red-100 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Your single blood donation can save up to three lives. Join our community of lifesavers today.
              </motion.p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Button size="lg" className="h-13 px-8 text-base bg-white text-red-600 hover:bg-red-50 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95">
                Become a Donor
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-13 px-8 text-base border-white/30 text-white hover:bg-white/10 rounded-full backdrop-blur-sm transition-all hover:scale-105 active:scale-95">
                <PhoneCall className="mr-2 w-5 h-5" />
                Emergency Request
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
