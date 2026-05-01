"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "general",
    message: "",
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

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border shadow-xl rounded-2xl p-8 relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-12 space-y-4 min-h-[400px]"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold">Message Sent!</h3>
            <p className="text-muted-foreground">
              Thank you for reaching out, {formData.firstName}. We've received your message and will get back to you at {formData.email} as soon as possible.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {
                setIsSuccess(false);
                setFormData({ firstName: "", lastName: "", email: "", subject: "general", message: "" });
              }}
            >
              Send Another Message
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                  <input 
                    id="firstName"
                    type="text" 
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.firstName ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                    placeholder="Jane" 
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                  <input 
                    id="lastName"
                    type="text" 
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.lastName ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                    placeholder="Doe" 
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input 
                  id="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full h-11 px-4 rounded-md border bg-background transition-all outline-none focus:ring-2 ${errors.email ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                  placeholder="jane@example.com" 
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <select 
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-md border border-input bg-background appearance-none focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                >
                  <option value="general">General Inquiry</option>
                  <option value="donation">Donation Appointment</option>
                  <option value="drive">Organize a Blood Drive</option>
                  <option value="feedback">Feedback & Suggestions</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea 
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full min-h-[150px] p-4 rounded-md border bg-background resize-y transition-all outline-none focus:ring-2 ${errors.message ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-input focus:ring-primary focus:border-primary"}`} 
                  placeholder="How can we help you today?"
                  aria-invalid={!!errors.message}
                ></textarea>
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>

              <Button size="lg" className="w-full h-12 text-base" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
