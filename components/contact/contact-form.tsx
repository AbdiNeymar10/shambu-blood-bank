"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function ContactForm() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border shadow-xl rounded-2xl p-8"
    >
      <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <input type="text" className="w-full h-11 px-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Jane" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <input type="text" className="w-full h-11 px-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Doe" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <input type="email" className="w-full h-11 px-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="jane@example.com" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <select className="w-full h-11 px-4 rounded-md border border-input bg-background appearance-none focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none">
            <option value="general">General Inquiry</option>
            <option value="donation">Donation Appointment</option>
            <option value="drive">Organize a Blood Drive</option>
            <option value="feedback">Feedback & Suggestions</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Message</label>
          <textarea 
            className="w-full min-h-[150px] p-4 rounded-md border border-input bg-background resize-y focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
            placeholder="How can we help you today?"
          ></textarea>
        </div>

        <Button size="lg" className="w-full h-12 text-base">
          <Send className="w-4 h-4 mr-2" />
          Send Message
        </Button>
      </form>
    </motion.div>
  );
}
