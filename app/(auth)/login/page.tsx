"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { GlassCard } from "@/components/shared/glass-card";
import { PrimaryButton } from "@/components/shared/primary-button";
import { loginDonor, type AuthActionResult } from "@/lib/actions/auth";
import { AlertCircle, ArrowRight, Lock, Mail, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [state, formAction] = useActionState(
    async (prevState: AuthActionResult | null, formData: FormData) => {
      setLoading(true);
      const res = await loginDonor(prevState, formData);
      setLoading(false);
      if (res.success && res.redirectTo) {
        window.location.href = res.redirectTo;
      }
      return res;
    },
    null
  );

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card/20 to-background">
      <Container size="narrow" className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <Logo size="lg" variant="full" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your donor dashboard and manage blood donations.
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8 shadow-xl border-border/80 relative overflow-hidden">
          {state?.error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
              <AlertCircle className="size-5 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Email Address
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="size-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-background/60 border border-border/80 rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            <PrimaryButton
              type="submit"
              size="lg"
              className="w-full justify-center text-base"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <span className="inline-flex items-center gap-2">
                  Sign In <ArrowRight className="size-4" />
                </span>
              )}
            </PrimaryButton>
          </form>

          <div className="mt-6 pt-6 border-t border-border/60 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Don't have a donor account yet?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Register as a Donor
              </Link>
            </p>

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ShieldAlert className="size-3.5 text-rose-500" />
                Hospital Staff & Admin Portal Sign In
              </Link>
            </div>
          </div>
        </GlassCard>
      </Container>
    </div>
  );
}
