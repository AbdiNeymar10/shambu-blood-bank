"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export function FeaturedArticle() {
  return (
    <section className="pt-8 pb-16 bg-background">
      <div className="container px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden group"
        >
          <div className="aspect-[2/1] min-h-[400px] w-full relative">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop" 
              alt="Medical breakthrough" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-8 md:p-12 md:w-2/3">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider rounded-full">
                  Medical News
                </span>
                <span className="text-white/80 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> 5 min read
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
                New Preservation Techniques Extend Blood Shelf Life by 20%
              </h2>
              
              <p className="text-white/80 text-lg mb-8 line-clamp-2 md:line-clamp-none max-w-2xl">
                Recent advancements in cold storage and additive solutions mean your donations can now save lives further afield and stay viable longer.
              </p>
              
              <Link href="/blog/new-preservation-techniques" className="inline-flex items-center text-white font-semibold group/btn">
                Read Full Article 
                <div className="ml-3 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:bg-primary transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
