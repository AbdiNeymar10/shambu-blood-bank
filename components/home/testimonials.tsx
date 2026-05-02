"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionHeader } from "@/components/shared";

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
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrentIndex((prev) => (prev + 1) % testimonials.length), []);
  const prev = useCallback(() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length), []);

  // Auto-play with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section className="section-padding bg-muted/30 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-1/3 h-[400px] bg-red-500/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <Container className="relative z-10">
        <SectionHeader
          align="center"
          eyebrow="Impact Stories"
          eyebrowIcon={<Star size={16} className="fill-amber-500 text-amber-500" />}
          eyebrowColor="amber"
          title="Voices of Hope"
          description="Read stories from our donors and the patients whose lives they've touched."
        />

        <div className="max-w-4xl mx-auto">
          <div
            className="relative bg-card border shadow-sm rounded-2xl p-6 sm:p-8 md:p-12 overflow-hidden min-h-[320px] md:min-h-[350px] flex flex-col justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-live="polite"
            aria-atomic="true"
          >
            <Quote className="absolute top-4 left-4 md:top-6 md:left-6 w-16 h-16 md:w-24 md:h-24 text-muted/50 -z-10 rotate-180" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="flex mb-5">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-500 text-amber-500 mr-0.5" />
                  ))}
                </div>
                <blockquote className="text-lg sm:text-xl md:text-2xl font-medium leading-relaxed mb-6 md:mb-8">
                  &ldquo;{testimonials[currentIndex].content}&rdquo;
                </blockquote>
                
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-lg font-bold text-red-600">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div>
                    <div className="font-bold text-base md:text-lg">{testimonials[currentIndex].author}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background/50 backdrop-blur-sm h-9 w-9"
                onClick={prev}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background/50 backdrop-blur-sm h-9 w-9"
                onClick={next}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-8 bg-red-600" : "w-1.5 bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
