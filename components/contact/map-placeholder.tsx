"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Phone, ExternalLink } from "lucide-react";
import Image from "next/image";
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
          className="relative rounded-2xl overflow-hidden bg-card border border-border shadow-md"
        >
          {/* Shambu location map image container */}
          <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden group">
            <Image
              src="/shambu_location_map.png"
              alt="Shambu Blood Bank Location Map, Horo Guduru Wollega, Oromia, Ethiopia"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            {/* Dark overlay gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

            {/* Map pin badge */}
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border shadow-lg flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-bold text-foreground">Shambu Blood Bank Center • Live Map</span>
            </div>

            {/* Floating marker tag over center */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-md bg-background/95 backdrop-blur-md p-4 rounded-xl border border-border/80 shadow-xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">
                  <MapPin className="w-4 h-4 text-primary fill-primary/20" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Shambu Headquarters</h4>
                  <p className="text-xs text-muted-foreground">Horo Guduru Wollega Zone, Oromia Region, Ethiopia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info bar */}
          <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border-t border-border/60">
            <div className="space-y-1.5">
              <h3 className="font-bold text-base md:text-lg text-foreground">Visit Our Center</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                Shambu Town, Horo Guduru Wollega, Oromia, Ethiopia
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0.5">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Mon–Sat: 8:00 AM – 6:00 PM
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-primary" /> +251 57 665 0123
                </span>
              </div>
            </div>
            <Button variant="default" className="rounded-xl shrink-0 gap-2 text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all" asChild>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Shambu+Blood+Bank+Horo+Guduru+Wollega+Ethiopia" 
                target="_blank" 
                rel="noreferrer"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
