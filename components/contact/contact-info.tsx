"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { getContactInfoData } from "@/lib/actions/contact";
import type { PublicSystemSettings } from "@/lib/actions/settings";

export function ContactInfo() {
  const [info, setInfo] = useState<PublicSystemSettings>({
    bloodBankName: "Shambu Blood Bank",
    emergencyHotline: "+251 57 665 0123",
    primaryContactEmail: "abitolesa23@gmail.com",
    locationAddress: "Shambu Town, Horo Guduru Wollega, Oromia, Ethiopia",
  });

  useEffect(() => {
    getContactInfoData().then((data) => {
      if (data) setInfo(data);
    });
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-display font-bold mb-4">Get in Touch</h2>
        <p className="text-muted-foreground text-lg">
          Have a question about donating? Want to organize a blood drive? Our team is here to help.
        </p>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold mb-1">Phone</h4>
            <p className="text-muted-foreground mb-1">
              General Inquiries: <a href={`tel:${info.emergencyHotline}`} className="text-foreground hover:text-primary transition-colors">{info.emergencyHotline}</a>
            </p>
            <p className="text-destructive font-semibold">Emergency Hotline: {info.emergencyHotline}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold mb-1">Email</h4>
            <p className="text-muted-foreground">
              <a href={`mailto:${info.primaryContactEmail}`} className="hover:text-primary transition-colors">{info.primaryContactEmail}</a>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold mb-1">Main Headquarters</h4>
            <p className="text-muted-foreground">
              {info.locationAddress}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold mb-1">Hours of Operation</h4>
            <p className="text-muted-foreground">Mon - Fri: 8:00 AM - 6:00 PM</p>
            <p className="text-muted-foreground">Sat - Sun: 9:00 AM - 3:00 PM</p>
          </div>
        </motion.div>
      </div>

      <div>
        <h4 className="font-bold mb-4">Follow Us</h4>
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
