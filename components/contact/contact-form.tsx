"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactMessage } from "@/lib/actions/contact";

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
  const [deliveredEmail, setDeliveredEmail] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);

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
    const res = await submitContactMessage(formData);
    setIsSubmitting(false);

    if (res.success) {
      setDeliveredEmail(!!res.deliveredEmail);
      setEmailErrorMsg(res.emailError || null);
      setIsSuccess(true);
    } else {
      setErrors((prev) => ({ ...prev, submit: res.error || "Failed to send message. Please try again." }));
    }
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
            <p className="text-muted-foreground max-w-md">
              Thank you for reaching out, {formData.firstName}. Your message has been logged securely in our system.
            </p>

            {deliveredEmail ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3.5 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-semibold max-w-md">
                ✓ Email successfully delivered to inbox!
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3.5 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-medium max-w-md space-y-1 text-left">
                <p className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  Saved to Database (Email Dispatch Note):
                </p>
                {emailErrorMsg ? (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-mono bg-amber-100/60 dark:bg-amber-900/40 p-2 rounded-lg break-words">
                    {emailErrorMsg}
                  </p>
                ) : (
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Logged in system database. Please ensure dev server is restarted to load .env.local keys.
                  </p>
                )}
              </div>
            )}

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
            {errors.submit && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errors.submit}</span>
              </div>
            )}
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
