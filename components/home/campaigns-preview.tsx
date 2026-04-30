"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const campaigns = [
  {
    id: 1,
    title: "City Center Mega Blood Drive",
    date: "Oct 15, 2026",
    time: "09:00 AM - 05:00 PM",
    location: "Grand Plaza Hotel, Downtown",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=600&h=400",
    status: "Upcoming",
  },
  {
    id: 2,
    title: "University Campus Donation Day",
    date: "Oct 22, 2026",
    time: "10:00 AM - 04:00 PM",
    location: "State University Student Union",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600&h=400",
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Corporate Lifesavers Event",
    date: "Nov 05, 2026",
    time: "08:00 AM - 02:00 PM",
    location: "Tech Park, Building C",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=600&h=400",
    status: "Upcoming",
  },
];

export function CampaignsPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-red-500/10 text-red-600 font-medium text-sm mb-6"
            >
              <CalendarDays size={16} className="mr-2" />
              Events & Campaigns
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            >
              Join Our Upcoming Drives
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Find a blood drive near you and make a difference in your community.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="outline" className="rounded-full group">
              View All Events
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-3xl overflow-hidden border bg-card hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-background/90 backdrop-blur-sm text-foreground">
                    {campaign.status}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-red-500 transition-colors">
                  {campaign.title}
                </h3>
                <div className="space-y-2 mb-6 text-sm text-muted-foreground flex-1">
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 text-red-500" />
                    {campaign.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-red-500" />
                    {campaign.time}
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-red-500" />
                    <span className="line-clamp-2">{campaign.location}</span>
                  </div>
                </div>
                <Button className="w-full rounded-full bg-red-50/50 hover:bg-red-100 text-red-600 border-none dark:bg-red-500/10 dark:hover:bg-red-500/20">
                  Register Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
