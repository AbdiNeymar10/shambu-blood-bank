"use client";

import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "Dr. Sarah Jenkins",
    role: "Chief Medical Officer",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
    bio: "Over 20 years of experience in hematology and blood bank management."
  },
  {
    name: "Michael Chen",
    role: "Director of Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    bio: "Ensures our logistics and supply chain are optimized for rapid response."
  },
  {
    name: "Amina Yusuf",
    role: "Head of Donor Relations",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    bio: "Passionate about building community trust and encouraging regular donations."
  },
  {
    name: "Dr. Robert Fox",
    role: "Lead Lab Technician",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
    bio: "Maintains our strict testing standards and quality control protocols."
  }
];

export function TeamSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Meet Our Leadership</h2>
          <p className="text-muted-foreground text-lg">
            Dedicated professionals committed to saving lives and maintaining the highest medical standards.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl mb-4 aspect-[4/5] bg-muted">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/20 hover:bg-primary flex items-center justify-center text-white backdrop-blur-sm transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/20 hover:bg-primary flex items-center justify-center text-white backdrop-blur-sm transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/20 hover:bg-primary flex items-center justify-center text-white backdrop-blur-sm transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <h4 className="text-xl font-bold">{member.name}</h4>
              <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
              <p className="text-muted-foreground text-sm">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
