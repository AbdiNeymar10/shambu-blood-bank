"use client";

import React, { useActionState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { GlassCard } from "@/components/shared/glass-card";
import { PrimaryButton } from "@/components/shared/primary-button";
import { loginAdmin } from "@/lib/actions/auth";
import { AlertCircle, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);

  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      window.location.href = state.redirectTo;
    }
  }, [state]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-red-950/10 to-background">
      <Container size="narrow" className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <Logo size="lg" variant="full" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="size-3.5" /> Administrative Access
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-display sm:text-3xl">
            Admin & Staff Portal
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with authorized administrator or hospital staff credentials.
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8 shadow-xl border-rose-500/30 relative overflow-hidden">
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
                Admin Email Address
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
                  placeholder="admin@shambubloodbank.org"
                  className="block w-full pl-10 pr-3 py-2.5 bg-background/60 border border-border/80 rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
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
              disabled={isPending}
            >
              {isPending ? (
                "Authenticating Admin..."
              ) : (
                <span className="inline-flex items-center gap-2">
                  Admin Sign In <ArrowRight className="size-4" />
                </span>
              )}
            </PrimaryButton>
          </form>

          <div className="mt-6 pt-6 border-t border-border/60 text-center">
            <Link
              href="/login"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Donor Login
            </Link>
          </div>
        </GlassCard>
      </Container>
    </div>
  );
}
