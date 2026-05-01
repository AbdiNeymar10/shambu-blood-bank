"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bloodType: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

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

          {/* Right Side - Form or Success State */}
          <div className="md:w-7/12 p-10 relative">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Registration Complete!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for taking the pledge to save lives. We have sent a confirmation email to <span className="font-medium text-foreground">{formData.email}</span> with your registration details.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({ firstName: "", lastName: "", email: "", phone: "", bloodType: "" });
                    }}
                  >
                    Register Another Person
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-foreground">Registration Details</h3>
                  <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                        <input 
                          id="firstName" 
                          type="text" 
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John" 
                          aria-invalid={!!errors.firstName}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${
                            errors.firstName 
                              ? "border-destructive focus:ring-destructive focus:border-destructive" 
                              : "border-input focus:ring-primary focus:border-primary"
                          }`}
                        />
                        {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                        <input 
                          id="lastName" 
                          type="text" 
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe" 
                          aria-invalid={!!errors.lastName}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${
                            errors.lastName 
                              ? "border-destructive focus:ring-destructive focus:border-destructive" 
                              : "border-input focus:ring-primary focus:border-primary"
                          }`}
                        />
                        {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                      <input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com" 
                        aria-invalid={!!errors.email}
                        className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${
                          errors.email 
                            ? "border-destructive focus:ring-destructive focus:border-destructive" 
                            : "border-input focus:ring-primary focus:border-primary"
                        }`}
                      />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                        <input 
                          id="phone" 
                          type="tel" 
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 123-4567" 
                          aria-invalid={!!errors.phone}
                          className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${
                            errors.phone 
                              ? "border-destructive focus:ring-destructive focus:border-destructive" 
                              : "border-input focus:ring-primary focus:border-primary"
                          }`}
                        />
                        {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="bloodType" className="text-sm font-medium text-foreground">Blood Type (if known)</label>
                        <select 
                          id="bloodType" 
                          value={formData.bloodType}
                          onChange={handleChange}
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
                      <Button size="lg" className="w-full group" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Find Appointments 
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        By clicking this button, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </section>
  );
}
