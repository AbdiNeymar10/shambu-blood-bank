"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    content: "When my daughter was in a severe car accident, she needed 12 units of blood. Shambu Blood Bank had the O- blood she needed immediately. We are forever grateful to the donors who saved her life.",
    author: "Sarah Jenkins",
    role: "Mother of Patient",
    avatar: "S",
    rating: 5,
  },
  {
    id: 2,
    content: "I've been donating blood every 8 weeks for the past 5 years. The staff here makes the process so easy and comfortable. It's a small time commitment for me, but it means the world to someone else.",
    author: "David Chen",
    role: "Regular Donor",
    avatar: "D",
    rating: 5,
  },
  {
    id: 3,
    content: "As an ER doctor, I rely on a steady, safe blood supply. The real-time inventory system and rapid emergency response from this bank have directly contributed to positive outcomes in our trauma center.",
    author: "Dr. Emily Rodriguez",
    role: "Trauma Surgeon",
    avatar: "E",
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-1/3 h-[500px] bg-red-500/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-yellow-500/10 text-yellow-600 font-medium text-sm mb-6"
          >
            <Star size={16} className="mr-2 fill-yellow-500" />
            Impact Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            Voices of Hope
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Read stories from our donors and the patients whose lives they've touched.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card border shadow-sm rounded-3xl p-8 md:p-12 overflow-hidden min-h-[350px] flex flex-col justify-center">
            <Quote className="absolute top-6 left-6 w-24 h-24 text-muted/50 -z-10 rotate-180" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="flex mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-yellow-500 text-yellow-500 mr-1" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed mb-8">
                  "{testimonials[currentIndex].content}"
                </blockquote>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xl font-bold text-red-600">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{testimonials[currentIndex].author}</div>
                    <div className="text-muted-foreground">{testimonials[currentIndex].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-8 right-8 flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm" onClick={prev}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm" onClick={next}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-8 bg-red-600" : "w-2 bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
