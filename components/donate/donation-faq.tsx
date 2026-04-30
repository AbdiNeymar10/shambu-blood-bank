"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long does a blood donation take?",
    answer: "The entire process takes about 45-60 minutes. This includes registration, a brief medical screening, the actual donation (which only takes 8-10 minutes), and 10-15 minutes of rest with refreshments afterward."
  },
  {
    question: "Does donating blood hurt?",
    answer: "You may feel a slight pinch when the needle goes in, but most donors do not feel pain during the donation itself. Our staff is highly trained to make the experience as comfortable as possible."
  },
  {
    question: "How much blood is taken?",
    answer: "A standard whole blood donation is about 1 pint (500 ml). Your body naturally replaces the plasma within 24 hours and the red cells within 4-6 weeks."
  },
  {
    question: "Can I donate if I have a tattoo or piercing?",
    answer: "In most cases, yes! As long as the tattoo or piercing was applied in a state-regulated facility using sterile needles and non-reused ink, there is no deferral period. Otherwise, there may be a 3-month deferral."
  },
  {
    question: "What should I eat before donating?",
    answer: "Eat a healthy, low-fat meal within 2-3 hours before donating. Make sure to drink plenty of water or non-alcoholic fluids. Avoid fatty foods like hamburgers or ice cream, as fat in your blood can interfere with testing."
  }
];

export function DonationFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Got questions? We've got answers. If you don't see your question here, feel free to contact us.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="border border-border rounded-xl overflow-hidden bg-card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between font-medium text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-lg pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 pt-2 text-muted-foreground border-t border-border/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
