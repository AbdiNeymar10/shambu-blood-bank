"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, Loader2, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPublicCampaignsList, type PublicCampaignItem } from "@/lib/actions/campaigns";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS = ["All Events", "Active", "Upcoming", "Completed"];

export function EventList() {
  const [events, setEvents] = useState<PublicCampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All Events");

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      const data = await getPublicCampaignsList();
      setEvents(data);
      setIsLoading(false);
    }
    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (selectedFilter === "All Events") return true;
    return event.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        
        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 mb-12 pb-6 border-b border-border">
          {FILTER_OPTIONS.map((filter) => (
            <Button 
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              variant={selectedFilter === filter ? "default" : "outline"} 
              className="rounded-full font-semibold text-xs transition-all"
            >
              {filter}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-sm font-medium">Loading community campaigns...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-2xl p-8 space-y-3">
            <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-bold text-foreground">No campaigns match this filter</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Check back soon for upcoming blood drives and community awareness rallies.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={cn(
                    "absolute top-4 left-4 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm",
                    event.status === "Active" ? "bg-emerald-500 text-white" :
                    event.status === "Upcoming" ? "bg-blue-600 text-white" :
                    "bg-secondary text-muted-foreground"
                  )}>
                    {event.status}
                  </div>
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full text-foreground">
                    Target: {event.targetUnits} Units
                  </div>
                </div>
                
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-3 mb-6 text-muted-foreground text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      {event.formattedDates}
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      {event.formattedTime}
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      {event.location}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-8 flex-grow line-clamp-3">
                    {event.description}
                  </p>
                  
                  <Link href="/donate">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                      Register to Donate
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
