"use client";

import { motion } from "framer-motion";
import {
  Heart,
  HandHeart,
  ShieldCheck,
  Scale,
  Sparkles,
  Stethoscope,
  Target,
  Eye,
  Building2,
  Calendar,
  Award
} from "lucide-react";
import Image from "next/image";

const coreValues = [
  {
    title: "Volunteerism",
    icon: Heart,
    description: "Inspiring selfless voluntary blood donation to serve our community without expectation of reward."
  },
  {
    title: "Humanity",
    icon: HandHeart,
    description: "Putting human life, dignity, and empathy at the heart of everything we do."
  },
  {
    title: "Confidentiality",
    icon: ShieldCheck,
    description: "Ensuring the absolute privacy and protection of donor and patient records."
  },
  {
    title: "Ethics",
    icon: Scale,
    description: "Upholding the highest moral, clinical, and regulatory standards in blood services."
  },
  {
    title: "Humbleness",
    icon: Sparkles,
    description: "Serving every individual with modesty, deep respect, and open-hearted care."
  },
  {
    title: "Integrity",
    icon: Award,
    description: "Maintaining total transparency, honesty, and accountability across all operations."
  },
  {
    title: "Professionalism",
    icon: Stethoscope,
    description: "Delivering clinical excellence using modern medical technologies and expert healthcare teams."
  }
];

export function CompanyStory() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-primary blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-accent-crimson blur-3xl mix-blend-multiply" />
      </div>

      <div className="container px-4 md:px-6 relative z-10 space-y-20">
        {/* Story & Introduction */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" /> About Shambu Blood Bank
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-foreground leading-tight">
              <span className="text-primary">A legacy of giving, a future of hope.</span>
            </h2>

            <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
              <p>
                Welcome to the Shambu Blood Bank, a vital organization committed to saving lives and enhancing the quality of life for all who needs blood. As we rapidly expand our capacity, we strive to meet the increasing national demand for blood and ensuring that safe and effective blood and tissue services are accessible to everyone.
              </p>
              <p>
                Our role encompasses managing the entire blood from collection and testing to processing and distribution. We prioritize voluntarism, operational efficiency, innovation, and the latest medical technologies, all of which guarantee the highest standards of quality in our services.
              </p>
              <p>
                The impact of our work is profound. Thanks to the selfless contributions of thousands of voluntary blood donors, many people have received essential red blood cells that are literally life-saving.
              </p>
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-foreground font-semibold text-sm md:text-base">
                We invite everyone to take action: start donating blood today and commit to donating every three months. Together, we can make a remarkable difference!
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative border border-border">
              <Image
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=2000&auto=format&fit=crop"
                alt="Shambu Blood Bank medical facility"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="font-bold text-lg">State-of-the-Art Blood Center</p>
                <p className="text-white/80 text-xs md:text-sm">Established by Oromia Health Bureau to ensure safe and accessible blood for all.</p>
              </div>
            </div>

            {/* Establishment Highlight Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-md flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Establishment & Foundation</h4>
                <p className="text-lg font-bold text-foreground">
                  Established on <span className="text-primary">June 28, 2017 E.C.</span>
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  Shambu Blood Bank was established in June 28/2017 EC by <span className="font-semibold text-foreground">Oromia Health Bureau</span>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-primary/20 rounded-3xl p-8 shadow-lg relative overflow-hidden group hover:border-primary/40 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-md shadow-primary/20">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold font-display text-foreground mb-3">Mission</h3>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
              To Provide Safe, Adequate and Quality Assured blood products and tissue service to all in need while promoting proper clinical use
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-primary/20 rounded-3xl p-8 shadow-lg relative overflow-hidden group hover:border-primary/40 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-md shadow-primary/20">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold font-display text-foreground mb-3">Vision</h3>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
              To be Center of Excellence Blood and tissue Service in Ethiopia
            </p>
          </motion.div>
        </div>

        {/* Core Values Section */}
        <div className="pt-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Our Guiding Principles</h2>
            <h3 className="text-3xl md:text-4xl font-display font-extrabold text-foreground">Values</h3>
            <p className="text-muted-foreground text-base">
              The core principles that drive our operations, clinical standards, and community service.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="bg-card border border-border/80 rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-2">{value.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
