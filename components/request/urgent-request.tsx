"use client";

import { motion } from "framer-motion";
import { AlertTriangle, PhoneCall, Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UrgentRequest() {
  return (
    <section className="py-12 bg-destructive text-destructive-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex flex-shrink-0 items-center justify-center animate-pulse">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Emergency Blood Request</h2>
              <p className="text-destructive-foreground/90 max-w-xl text-lg">
                If a patient is in critical condition and requires immediate blood transfusion, bypass the standard form and call our 24/7 emergency hotline.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto text-destructive bg-white hover:bg-white/90">
              <PhoneCall className="w-5 h-5 mr-2" />
              1-800-EMERGENCY
            </Button>
            <Button size="lg" className="w-full sm:w-auto bg-black/20 hover:bg-black/30 text-white border-none">
              <Ambulance className="w-5 h-5 mr-2" />
              Hospital Portal
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
