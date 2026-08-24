"use client";

import { motion } from "framer-motion";
import { AlertTriangle, PhoneCall, Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared";

export function UrgentRequest() {
  return (
    <section className="py-10 bg-background">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden bg-red-600 border border-red-500 shadow-2xl p-8 sm:p-10 text-white max-w-5xl mx-auto"
        >
          {/* Decorative background glow & pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-700/50 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center md:items-start text-center sm:text-left gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex flex-shrink-0 items-center justify-center animate-pulse shadow-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1.5 max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">Emergency Blood Request</h2>
                <p className="text-red-100 text-sm sm:text-base leading-relaxed">
                  If a patient is in critical condition and requires immediate blood transfusion, bypass the standard form and call our 24/7 emergency hotline.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Button size="lg" asChild className="w-full sm:w-auto text-red-600 bg-white hover:bg-red-50 font-bold rounded-2xl shadow-lg border-none hover:scale-105 active:scale-95 transition-all">
                <a href="tel:+251576650123">
                  <PhoneCall className="w-5 h-5 mr-2" />
                  1-800-EMERGENCY
                </a>
              </Button>
              <Button size="lg" asChild className="w-full sm:w-auto bg-black/25 hover:bg-black/40 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all">
                <a href="/login">
                  <Ambulance className="w-5 h-5 mr-2" />
                  Hospital Portal
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
