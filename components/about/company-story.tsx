"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Users, Target } from "lucide-react";

const stats = [
  { label: "Donors Registered", value: "50,000+" },
  { label: "Lives Saved", value: "150,000+" },
  { label: "Partner Hospitals", value: "120+" },
  { label: "Years of Service", value: "15+" },
];

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "Every drop donated is a story of hope. We treat our donors and recipients with the utmost care and empathy."
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Stringent testing and advanced storage ensure that our blood supply is consistently safe and reliable."
  },
  {
    icon: Users,
    title: "Community",
    description: "We build bridges between generous donors and patients in need, fostering a spirit of unity."
  },
  {
    icon: Target,
    title: "Efficiency",
    description: "Rapid response times and streamlined processes to deliver life-saving blood precisely when it is needed."
  }
];

export function CompanyStory() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-primary blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-accent-crimson blur-3xl mix-blend-multiply" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold tracking-wider text-primary uppercase mb-3">Our Story</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
              A legacy of giving, a future of hope.
            </h3>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Founded in 2008, Shambu Blood Bank began with a simple mission: to ensure no life is lost due to a shortage of safe blood. What started as a small community initiative has grown into a regional lifeline.
              </p>
              <p>
                Driven by a passionate team of medical professionals and thousands of selfless donors, we have modernized blood collection, testing, and distribution. We believe that everyone has the power to be a hero.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-10">
              {stats.map((stat, idx) => (
                <div key={idx} className="border-l-2 border-primary/20 pl-4">
                  <div className="text-3xl font-display font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=2000&auto=format&fit=crop" 
                alt="Medical professionals analyzing blood samples" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-medium text-lg">State-of-the-art testing facility</p>
                <p className="text-white/80 text-sm">Ensuring 100% safe blood supply since day one.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="pt-16 border-t border-border/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              The principles that guide our every action, ensuring we maintain the highest standards of care and integrity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all hover:border-primary/20 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-6 h-6 text-primary group-hover:text-current transition-colors" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
