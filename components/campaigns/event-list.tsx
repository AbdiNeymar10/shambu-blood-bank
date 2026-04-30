"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  {
    title: "Citywide Mega Blood Drive",
    date: "Oct 15, 2026",
    time: "8:00 AM - 6:00 PM",
    location: "Downtown Community Center",
    image: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=800&auto=format&fit=crop",
    category: "Mega Drive",
    description: "Join us for our largest annual blood drive. Food trucks, live music, and free health screenings for all participants."
  },
  {
    title: "Corporate Lifesavers Initiative",
    date: "Oct 22, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "Tech Park Plaza",
    image: "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?q=80&w=800&auto=format&fit=crop",
    category: "Mobile Drive",
    description: "Partnering with top tech firms to make donating convenient for office workers. Open to the public."
  },
  {
    title: "University Hero Challenge",
    date: "Nov 05, 2026",
    time: "10:00 AM - 5:00 PM",
    location: "State University Student Union",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop",
    category: "Campus Drive",
    description: "Calling all students! Help your faculty win the semester trophy by donating. Free merchandise for first-time donors."
  },
  {
    title: "World Blood Donor Day Gala",
    date: "Nov 12, 2026",
    time: "6:00 PM - 9:00 PM",
    location: "Grand Heritage Hotel",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop",
    category: "Awareness Event",
    description: "An evening to honor our most dedicated donors and partners. Ticket proceeds go towards purchasing new mobile collection units."
  }
];

export function EventList() {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        
        {/* Filter bar mock */}
        <div className="flex flex-wrap gap-4 mb-12 pb-6 border-b border-border">
          <Button variant="default" className="rounded-full">All Events</Button>
          <Button variant="outline" className="rounded-full">Blood Drives</Button>
          <Button variant="outline" className="rounded-full">Awareness</Button>
          <Button variant="outline" className="rounded-full">Fundraisers</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                  {event.category}
                </div>
              </div>
              
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-3 mb-6 text-muted-foreground text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    {event.location}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-8 flex-grow">
                  {event.description}
                </p>
                
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                  Register Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
