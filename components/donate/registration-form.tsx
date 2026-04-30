"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

export function RegistrationForm() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side - Info */}
          <div className="bg-primary text-primary-foreground md:w-5/12 p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-display font-bold mb-4">Book Your Appointment</h3>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                Scheduling a donation is the best way to ensure a quick and smooth process. Walk-ins are welcome, but appointments are prioritized.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Pick a Date</h4>
                    <p className="text-primary-foreground/80 text-sm">Appointments available up to 4 weeks in advance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Select Location</h4>
                    <p className="text-primary-foreground/80 text-sm">Choose from 5 permanent centers or our mobile drives.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Save Time</h4>
                    <p className="text-primary-foreground/80 text-sm">Complete your RapidPass reading and health history online the day of your donation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm text-primary-foreground/80">Need help? Call us at <br/><span className="font-bold text-lg text-white">1-800-GIVE-LIFE</span></p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-7/12 p-10">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Registration Details</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                  <input 
                    id="firstName" 
                    type="text" 
                    placeholder="John" 
                    className="w-full h-11 px-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                  <input 
                    id="lastName" 
                    type="text" 
                    placeholder="Doe" 
                    className="w-full h-11 px-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="john.doe@example.com" 
                  className="w-full h-11 px-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                  <input 
                    id="phone" 
                    type="tel" 
                    placeholder="(555) 123-4567" 
                    className="w-full h-11 px-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bloodType" className="text-sm font-medium text-foreground">Blood Type (if known)</label>
                  <select 
                    id="bloodType" 
                    className="w-full h-11 px-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none"
                  >
                    <option value="">Select...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="unknown">I don't know</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <Button size="lg" className="w-full group">
                  Find Appointments 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  By clicking this button, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
}
