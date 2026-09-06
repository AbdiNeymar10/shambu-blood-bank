"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Lock,
  Mail,
  Building2,
  ShieldCheck,
} from "lucide-react";
import {
  checkEmailExists,
  getDonationCenters,
  registerNewDonorAndBookAppointment,
  bookAppointmentForExistingUser,
  type CenterOption,
  type RegisterDonorAppointmentResult,
} from "@/lib/actions/donate";
import { createClient } from "@/lib/supabase/client";

type Step = "details" | "existing_account" | "select_appointment" | "create_account" | "success";

const TIME_SLOTS = [
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
];

export function RegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");

  // User input state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bloodType: "",
  });

  // Account creation state
  const [accountData, setAccountData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Existing user inline login state
  const [loginPassword, setLoginPassword] = useState("");

  // Appointment selection state
  const [centers, setCenters] = useState<CenterOption[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("09:00 AM");

  // Auth & flow control state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState<RegisterDonorAppointmentResult | null>(null);

  // Initialize tomorrow's date for appointment selector
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    setSelectedDate(dateStr);
  }, []);

  // Check if user is already logged in & load centers on mount
  useEffect(() => {
    const supabase = createClient();

    // Load available centers
    getDonationCenters().then((data) => {
      setCenters(data);
      if (data.length > 0) {
        setSelectedCenterId(data[0].id);
      }
    });

    // Check user auth session
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true);
        let email = user.email || "";
        let firstName = "";
        let lastName = "";
        let phone = "";
        let bloodType = "";

        const fullName = (user.user_metadata?.full_name as string) || "";
        if (fullName) {
          const parts = fullName.split(" ");
          firstName = parts[0] || "";
          lastName = parts.slice(1).join(" ") || "";
        }

        // Check public.users and donor_profiles
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: userRow } = await (supabase as any)
          .from("users")
          .select("id, full_name, phone, email")
          .eq("auth_id", user.id)
          .maybeSingle();

        if (userRow) {
          if (userRow.email) email = userRow.email;
          if (userRow.phone) phone = userRow.phone;
          if (userRow.full_name) {
            const parts = userRow.full_name.split(" ");
            firstName = parts[0] || "";
            lastName = parts.slice(1).join(" ") || "";
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: dp } = await (supabase as any)
            .from("donor_profiles")
            .select("blood_group")
            .eq("user_id", userRow.id)
            .maybeSingle();

          if (dp?.blood_group) {
            bloodType = dp.blood_group;
          }
        }

        setFormData((prev) => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          email: email || prev.email,
          phone: phone || prev.phone,
          bloodType: bloodType || prev.bloodType,
        }));
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountData({ ...accountData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  // STEP 1 Validation: Check registration inputs
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // STEP 1 HANDLER: "Find Available Appointments"
  const handleFindAppointments = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitError("");
    if (!validateStep1()) {
      setSubmitError("Please fill out all required fields marked below.");
      return;
    }

    setIsSubmitting(true);
    try {
      // If user is already logged in, skip email check and go directly to appointment selection
      if (isLoggedIn) {
        setIsSubmitting(false);
        setStep("select_appointment");
        return;
      }

      // Check if email already belongs to an existing account
      const checkRes = await checkEmailExists(formData.email);
      setIsSubmitting(false);

      if (checkRes.exists) {
        setStep("existing_account");
      } else {
        setStep("select_appointment");
      }
    } catch {
      setIsSubmitting(false);
      setSubmitError("An error occurred while checking available appointments. Please try again.");
    }
  };

  // HANDLER: Existing user inline login
  const handleExistingUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!loginPassword) {
      setSubmitError("Please enter your password to sign in.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: loginPassword,
      });

      setIsSubmitting(false);

      if (error) {
        setSubmitError(error.message || "Invalid password. Please check your credentials and try again.");
        return;
      }

      if (data.user) {
        setIsLoggedIn(true);
        setStep("select_appointment");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err?.message || "Failed to log in. Please try again.");
    }
  };

  // STEP 2 HANDLER: Continue from Appointment Selection
  const handleSelectAppointmentContinue = () => {
    setSubmitError("");
    if (!selectedCenterId) {
      setSubmitError("Please select a collection center.");
      return;
    }
    if (!selectedDate) {
      setSubmitError("Please select a date for your appointment.");
      return;
    }

    // If user is logged in, confirm appointment directly
    if (isLoggedIn) {
      handleFinalAppointmentConfirmLoggedIn();
    } else {
      // If new visitor, prompt for account creation
      setStep("create_account");
    }
  };

  // HANDLER: Confirm appointment for logged in user
  const handleFinalAppointmentConfirmLoggedIn = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await bookAppointmentForExistingUser({
        email: formData.email,
        hospitalId: selectedCenterId,
        date: selectedDate,
        time: selectedTime,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bloodType: formData.bloodType,
      });

      setIsSubmitting(false);

      if (res.success) {
        setConfirmationDetails(res);
        setStep("success");
      } else {
        setSubmitError(res.error || "Failed to confirm your appointment. Please try again.");
      }
    } catch {
      setIsSubmitting(false);
      setSubmitError("An error occurred while confirming your appointment. Please try again.");
    }
  };

  // STEP 3 HANDLER: Account Creation & Final Appointment Confirmation
  const handleCreateAccountAndConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors: Record<string, string> = {};
    if (!accountData.password) {
      newErrors.password = "Password is required";
    } else if (accountData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!accountData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (accountData.password !== accountData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitError("Please fix the errors below before confirming.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await registerNewDonorAndBookAppointment({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bloodType: formData.bloodType,
        password: accountData.password,
        hospitalId: selectedCenterId,
        date: selectedDate,
        time: selectedTime,
      });

      setIsSubmitting(false);

      if (res.success) {
        // Also log user in on client side session if possible
        try {
          const supabase = createClient();
          await supabase.auth.signInWithPassword({
            email: formData.email.trim(),
            password: accountData.password,
          });
          setIsLoggedIn(true);
        } catch {}

        setConfirmationDetails(res);
        setStep("success");
      } else {
        setSubmitError(res.error || "Failed to create account and confirm appointment.");
      }
    } catch {
      setIsSubmitting(false);
      setSubmitError("An error occurred during account creation. Please try again.");
    }
  };

  const getSelectedCenterName = () => {
    const found = centers.find((c) => c.id === selectedCenterId);
    return found ? found.name : "Shambu Blood Bank Center";
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side - Information Panel (Preserved Design) */}
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
                    <p className="text-primary-foreground/80 text-sm">Choose from our permanent centers or mobile drives.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Save Time</h4>
                    <p className="text-primary-foreground/80 text-sm">Complete your RapidPass reading and health history online.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm text-primary-foreground/80">Need help? Call us at <br/><span className="font-bold text-lg text-white">1-800-GIVE-LIFE</span></p>
            </div>
          </div>

          {/* Right Side - Interactive Form Steps */}
          <div className="md:w-7/12 p-10 relative">
            <AnimatePresence mode="wait">

              {/* STEP 1: Registration Basic Information */}
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-foreground">Registration Details</h3>
                    {isLoggedIn && (
                      <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Logged In
                      </span>
                    )}
                  </div>
                  
                  {submitError && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3 mb-6">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <form className="space-y-6" onSubmit={handleFindAppointments} noValidate>
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
                          className="w-full h-11 px-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none text-foreground"
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
                      <Button type="submit" size="lg" className="w-full group" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Checking Availability...
                          </>
                        ) : (
                          <>
                            Find Available Appointments 
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        By proceeding, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 2A: Email Exists - Prompt Log In */}
              {step === "existing_account" && (
                <motion.div
                  key="existing_account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-base">
                      <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <span>Welcome back! An account already exists with this email.</span>
                    </div>
                    <p className="text-sm opacity-90">
                      We found an existing account for <span className="font-semibold text-foreground underline">{formData.email}</span>. Please log in to continue with your appointment booking.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleExistingUserLogin} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-muted/50 text-muted-foreground font-medium text-sm outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="loginPassword" className="text-sm font-medium text-foreground">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="loginPassword"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-2 space-y-3">
                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          "Log In to Continue"
                        )}
                      </Button>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <button
                          type="button"
                          onClick={() => setStep("details")}
                          className="hover:underline text-primary font-medium"
                        >
                          Use a different email
                        </button>
                        <a href="/forgot-password" className="hover:underline text-muted-foreground">
                          Forgot password?
                        </a>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 2B: Select Available Appointment Options */}
              {step === "select_appointment" && (
                <motion.div
                  key="select_appointment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <button
                      onClick={() => setStep("details")}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-3 font-medium transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Registration Details
                    </button>
                    <h3 className="text-2xl font-bold text-foreground">Select Appointment Option</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose your preferred donation center, date, and convenient time slot.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Collection Center Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" /> Collection Center
                      </label>
                      <select
                        value={selectedCenterId}
                        onChange={(e) => setSelectedCenterId(e.target.value)}
                        className="w-full h-11 px-4 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      >
                        {centers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" /> Appointment Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full h-11 px-4 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      />
                    </div>

                    {/* Time Slot Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> Preferred Time Slot
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                              selectedTime === slot
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-background text-foreground border-border hover:bg-secondary"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        type="button"
                        size="lg"
                        className="w-full group"
                        onClick={handleSelectAppointmentContinue}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : isLoggedIn ? (
                          <>
                            Confirm Appointment
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        ) : (
                          <>
                            Continue to Create Account
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Create Donor Account Prompt (For New Visitors) */}
              {step === "create_account" && (
                <motion.div
                  key="create_account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <button
                      onClick={() => setStep("select_appointment")}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-3 font-medium transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Appointment Selection
                    </button>
                    <h3 className="text-2xl font-bold text-foreground">Create Your Donor Account</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create an account to manage your appointment, receive notifications, and track your donation history.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Summary of Preserved Details */}
                  <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/60 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Donor Name:</span>
                      <span className="font-bold text-foreground">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Selected Center:</span>
                      <span className="font-bold text-foreground">{getSelectedCenterName()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Date & Time:</span>
                      <span className="font-bold text-foreground">{selectedDate} at {selectedTime}</span>
                    </div>
                  </div>

                  <form onSubmit={handleCreateAccountAndConfirm} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-muted/50 text-muted-foreground font-medium text-sm outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="password"
                          type="password"
                          value={accountData.password}
                          onChange={handleAccountChange}
                          placeholder="••••••••"
                          required
                          aria-invalid={!!errors.password}
                          className={`w-full h-11 pl-10 pr-4 rounded-md border bg-background text-foreground text-sm outline-none focus:ring-2 ${
                            errors.password ? "border-destructive focus:ring-destructive" : "border-input focus:ring-primary focus:border-primary"
                          }`}
                        />
                      </div>
                      {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="confirmPassword"
                          type="password"
                          value={accountData.confirmPassword}
                          onChange={handleAccountChange}
                          placeholder="••••••••"
                          required
                          aria-invalid={!!errors.confirmPassword}
                          className={`w-full h-11 pl-10 pr-4 rounded-md border bg-background text-foreground text-sm outline-none focus:ring-2 ${
                            errors.confirmPassword ? "border-destructive focus:ring-destructive" : "border-input focus:ring-primary focus:border-primary"
                          }`}
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div className="pt-3">
                      <Button type="submit" size="lg" className="w-full group" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Creating Account & Booking...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="mr-2 w-5 h-5" />
                            Confirm Appointment
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 4: Success Screen */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-6"
                >
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Appointment Confirmed!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-sm mt-1">
                      Thank you for scheduling your blood donation. Your appointment has been set to <span className="font-semibold text-foreground">Scheduled</span> status.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="w-full bg-secondary/50 border border-border/80 rounded-2xl p-5 text-left text-sm space-y-2.5">
                    <div className="flex justify-between border-b border-border/60 pb-2">
                      <span className="text-muted-foreground">Donor Name:</span>
                      <span className="font-bold text-foreground">{confirmationDetails?.fullName || `${formData.firstName} ${formData.lastName}`}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                      <span className="text-muted-foreground">Collection Center:</span>
                      <span className="font-bold text-foreground">{confirmationDetails?.centerName || getSelectedCenterName()}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/60 pb-2">
                      <span className="text-muted-foreground">Date & Time:</span>
                      <span className="font-bold text-foreground">
                        {confirmationDetails?.dateFormatted || selectedDate} at {confirmationDetails?.timeFormatted || selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Scheduled</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => router.push("/donor/appointments")}
                    >
                      Go to Donor Portal
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setStep("details");
                        setConfirmationDetails(null);
                        setAccountData({ password: "", confirmPassword: "" });
                      }}
                    >
                      Book Another Appointment
                    </Button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </section>
  );
}
