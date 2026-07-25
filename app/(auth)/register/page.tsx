"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { GlassCard } from "@/components/shared/glass-card";
import { PrimaryButton } from "@/components/shared/primary-button";
import { registerDonor, type AuthActionResult } from "@/lib/actions/auth";
import type { BloodGroup } from "@/types/database.types";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Droplet,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

const BLOOD_GROUPS: readonly BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [state, formAction] = useActionState(
    async (prevState: AuthActionResult | null, formData: FormData) => {
      setLoading(true);
      const res = await registerDonor(prevState, formData);
      setLoading(false);
      if (res.success && res.redirectTo) {
        router.push(res.redirectTo);
      }
      return res;
    },
    null
  );

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card/20 to-background">
      <Container size="narrow" className="max-w-xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <Logo size="lg" variant="full" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display sm:text-3xl">
            Become a Blood Donor
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register to join the Shambu emergency donor network and save lives.
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8 shadow-xl border-border/80 relative overflow-hidden">
          {state?.error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          {state?.message && state?.success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm flex items-start gap-3">
              <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
              <span>{state.message}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Full Name *
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <User className="size-4" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Abebe Bikila"
                    className="block w-full pl-10 pr-3 py-2.5 bg-background/60 border border-border/80 rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email Address *
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="size-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    className="block w-full pl-10 pr-3 py-2.5 bg-background/60 border border-border/80 rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Password *
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="size-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2.5 bg-background/60 border border-border/80 rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Phone Number
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Phone className="size-4" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+251 91 234 5678"
                    className="block w-full pl-10 pr-3 py-2.5 bg-background/60 border border-border/80 rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Blood Group *
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-500">
                    <Droplet className="size-4" />
                  </div>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    required
                    defaultValue="O+"
                    className="block w-full pl-10 pr-3 py-2.5 bg-background/60 border border-border/80 rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none"
                  >
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group} className="bg-background text-foreground">
                        {group} Blood
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Date of Birth *
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Calendar className="size-4" />
                  </div>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-background/60 border border-border/80 rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  City
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <MapPin className="size-4" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    defaultValue="Shambu"
                    placeholder="Shambu"
                    className="block w-full pl-10 pr-3 py-2.5 bg-background/60 border border-border/80 rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Subcity / Kebele / Area
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Kebele 01, Near Shambu Hospital"
                  className="block w-full px-3 py-2.5 bg-background/60 border border-border/80 rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            <PrimaryButton
              type="submit"
              size="lg"
              className="w-full justify-center text-base mt-2"
              disabled={loading}
            >
              {loading ? (
                "Creating Donor Account..."
              ) : (
                <span className="inline-flex items-center gap-2">
                  Complete Registration <ArrowRight className="size-4" />
                </span>
              )}
            </PrimaryButton>
          </form>

          <div className="mt-6 pt-6 border-t border-border/60 text-center">
            <p className="text-sm text-muted-foreground">
              Already registered as a donor?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </GlassCard>
      </Container>
    </div>
  );
}
