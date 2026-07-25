import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { GlassCard } from "@/components/shared/glass-card";
import { SecondaryButton } from "@/components/shared/secondary-button";
import { ArrowLeft, MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-card/20 to-background">
      <Container size="narrow" className="max-w-md w-full text-center">
        <div className="inline-flex justify-center mb-6">
          <Logo size="lg" variant="full" />
        </div>

        <GlassCard className="p-8 shadow-xl border-border/80 relative overflow-hidden text-center space-y-6">
          <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto">
            <MailCheck className="size-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
              Check Your Inbox
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We have sent an email verification link to your email address. Please click the link to confirm your account and access your donor dashboard.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <SecondaryButton asChild size="lg" className="w-full justify-center">
              <Link href="/login">
                <ArrowLeft className="size-4 mr-2" /> Proceed to Login
              </Link>
            </SecondaryButton>
          </div>
        </GlassCard>
      </Container>
    </div>
  );
}
