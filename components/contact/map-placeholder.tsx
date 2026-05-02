"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared";
import { fadeInUp, viewportOnce } from "@/lib/motion";

export function MapPlaceholder() {
  return (
    <section className="section-padding bg-muted/20 border-t border-border/40">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="relative rounded-2xl overflow-hidden bg-card border border-border shadow-sm"
        >
          {/* Styled map area */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-muted via-muted/50 to-secondary overflow-hidden">
            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Center pin */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 animate-[pulse-subtle_3s_ease-in-out_infinite]">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary/20 rounded-full blur-sm" />
              </div>
            </div>
            {/* Concentric rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 border border-primary/10 rounded-full" />
              <div className="absolute w-56 h-56 border border-primary/5 rounded-full" />
              <div className="absolute w-80 h-80 border border-primary/[0.03] rounded-full" />
            </div>
          </div>

          {/* Info bar */}
          <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card">
            <div className="space-y-1">
              <h3 className="font-bold text-base md:text-lg">Visit Our Center</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                Shambu Blood Bank, City Center, India
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Mon–Sat, 8AM–8PM
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> +91 98765 43210
                </span>
              </div>
            </div>
            <Button variant="outline" className="rounded-full shrink-0 gap-2 text-sm" asChild>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer">
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
