"use client";

import { motion } from "framer-motion";
import { UserCheck, ShieldCheck, Mail, Building2 } from "lucide-react";
import Image from "next/image";

export function TeamSection() {
  return (
    <section className="py-20 md:py-24 bg-background border-t border-border/50">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" /> Executive Leadership
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Our Leadership</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Dedicated leadership guiding Shambu Blood Bank&apos;s mission to save lives and ensure safe, accessible blood services.
          </p>
        </div>

        {/* Single CEO Leadership Card */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 grid md:grid-cols-12 gap-0 group"
          >
            {/* Image Column */}
            <div className="md:col-span-5 relative aspect-[4/5] md:aspect-auto min-h-[320px] bg-muted overflow-hidden">
              <Image
                src="/images/shifera-tolesa.png"
                alt="Shifera Tolesa - Chief Executive Officer"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
              <div className="absolute bottom-4 left-4 right-4 md:hidden text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-[10px] font-extrabold uppercase tracking-wider mb-1">
                  CEO
                </span>
                <h4 className="text-xl font-bold">Shifera Tolesa</h4>
                <p className="text-xs text-white/80">Chief Executive Officer</p>
              </div>
            </div>

            {/* Details Column */}
            <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-center space-y-4">
              <div className="hidden md:block">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                  <UserCheck className="w-3.5 h-3.5" /> Chief Executive Officer
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold text-foreground">
                  Shifera Tolesa
                </h3>
                <p className="text-primary font-semibold text-sm">
                  Chief Executive Officer (CEO)
                </p>
              </div>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Spearheading Shambu Blood Bank&apos;s strategic growth, clinical operations, and voluntary donation initiatives to provide safe, quality-assured blood products for all in need across Ethiopia.
              </p>

              <div className="pt-2 border-t border-border/60 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center gap-1.5 text-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Executive Management</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-foreground">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>Shambu Blood Bank</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
