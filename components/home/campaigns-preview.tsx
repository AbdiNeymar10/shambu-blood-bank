"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionHeader } from "@/components/shared";
import { staggerContainer, fadeInUp, viewportOnce } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";

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
    <section className="section-padding bg-background">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <SectionHeader
            eyebrow="Events & Campaigns"
            eyebrowIcon={<CalendarDays size={16} />}
            eyebrowColor="red"
            title="Join Our Upcoming Drives"
            description="Find a blood drive near you and make a difference in your community."
            className="mb-0"
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
          >
            <Button variant="outline" className="rounded-full group shrink-0">
              View All Events
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              variants={fadeInUp}
              className="group rounded-2xl overflow-hidden border bg-card hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col hover:-translate-y-0.5"
            >
              <div className="relative h-44 md:h-48 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-background/90 backdrop-blur-sm text-foreground uppercase tracking-wider">
                    {campaign.status}
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-red-500 transition-colors">
                  {campaign.title}
                </h3>
                <div className="space-y-1.5 mb-5 text-sm text-muted-foreground flex-1">
                  <div className="flex items-center">
                    <CalendarDays className="w-3.5 h-3.5 mr-2 text-red-500 shrink-0" />
                    {campaign.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-2 text-red-500 shrink-0" />
                    {campaign.time}
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-3.5 h-3.5 mr-2 mt-0.5 shrink-0 text-red-500" />
                    <span className="line-clamp-2">{campaign.location}</span>
                  </div>
                </div>
                <Button className="w-full rounded-full bg-red-50/50 hover:bg-red-100 text-red-600 border-none dark:bg-red-500/10 dark:hover:bg-red-500/20 text-sm">
                  Register Now
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
