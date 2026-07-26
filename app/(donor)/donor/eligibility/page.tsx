"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  CalendarCheck,
  AlertCircle,
  Droplets,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { getEligibilityInfo, type EligibilityInfo } from "@/lib/actions/eligibility";

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm flex items-start gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${accent ?? "bg-primary/10"}`}>
        <Icon className={`w-5 h-5 ${accent ? "text-white" : "text-primary"}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-foreground mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Circular progress
// ---------------------------------------------------------------------------
function CircularProgress({ percent, eligible }: { percent: number; eligible: boolean }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const color = eligible ? "#10b981" : percent >= 66 ? "#3b82f6" : percent >= 33 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
        <circle
          cx="64" cy="64" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-foreground">{percent}%</span>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Recovery</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DonorEligibilityPage() {
  const [info, setInfo] = useState<EligibilityInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await getEligibilityInfo();
    setInfo(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Realtime: re-fetch when a new donation is inserted/updated
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("eligibility-donations")
      .on("postgres_changes", { event: "*", schema: "public", table: "blood_donations" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "donor_profiles" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!info) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground/50" />
        <p className="text-lg font-semibold text-muted-foreground">Could not load eligibility data.</p>
        <p className="text-sm text-muted-foreground">Please sign in and ensure your donor profile is set up.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
          Next Eligibility
        </h1>
        <p className="text-muted-foreground font-medium">
          Whole blood donations require a 90-day recovery period between each donation.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Status Hero Card                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Card className={`border-2 shadow-md ${info.isEligible ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/60"}`}>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Circular progress */}
            <div className="shrink-0">
              <CircularProgress percent={info.progressPercent} eligible={info.isEligible} />
            </div>

            {/* Status text */}
            <div className="flex-1 text-center md:text-left space-y-3">
              {info.isEligible ? (
                <>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold text-sm px-3 py-1">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 inline" />
                    Eligible to Donate
                  </Badge>
                  <h2 className="text-2xl font-black text-foreground">
                    {info.hasDonationHistory ? "You're ready to donate again!" : "You can donate for the first time!"}
                  </h2>
                  <p className="text-muted-foreground">
                    {info.hasDonationHistory
                      ? "Your 90-day recovery period is complete. Book an appointment to schedule your next donation."
                      : "No donation history found. You are eligible to make your first blood donation."}
                  </p>
                  <Button asChild className="mt-2 font-bold gap-2">
                    <Link href="/donor/appointments">
                      <CalendarCheck className="w-4 h-4" />
                      Book an Appointment
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold text-sm px-3 py-1">
                    <Clock className="w-4 h-4 mr-1.5 inline" />
                    Recovery in Progress
                  </Badge>
                  <h2 className="text-2xl font-black text-foreground">
                    {info.daysRemaining} day{info.daysRemaining === 1 ? "" : "s"} remaining
                  </h2>
                  <p className="text-muted-foreground">
                    You donated recently. Your body needs time to fully replenish your blood supply.
                    You'll be eligible again on{" "}
                    <strong className="text-foreground">{info.nextEligibleFormatted}</strong>.
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                      <span>Last donation</span>
                      <span>Eligible on {info.nextEligibleFormatted}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${info.progressPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{info.progressPercent}% of recovery complete</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Stat Grid                                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={Droplets}
          label="Last Donation Date"
          value={info.lastDonationFormatted ?? "No donations yet"}
          sub={info.lastDonationDate ? `${info.progressPercent}% of 90-day wait complete` : "First-time donor"}
        />
        <StatCard
          icon={Calendar}
          label="Next Eligible Date"
          value={info.nextEligibleFormatted ?? "Eligible now"}
          sub={info.isEligible ? "You can donate today!" : `${info.daysRemaining} days away`}
        />
        <StatCard
          icon={info.isEligible ? CheckCircle2 : Clock}
          label="Days Remaining"
          value={info.isEligible ? "0 — Eligible!" : `${info.daysRemaining} days`}
          sub={info.isEligible ? "Recovery complete" : "Until next eligible date"}
          accent={info.isEligible ? "bg-emerald-500" : undefined}
        />
        <StatCard
          icon={Heart}
          label="Eligibility Status"
          value={info.isEligible ? "Eligible" : "Not Yet Eligible"}
          sub={info.isEligible ? "Ready to save lives" : "Recovery period ongoing"}
          accent={info.isEligible ? "bg-emerald-500" : undefined}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Info panel                                                            */}
      {/* ------------------------------------------------------------------ */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Why 90 Days?
          </CardTitle>
          <CardDescription>
            Understanding the whole blood donation recovery period
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            After donating whole blood, your body needs time to replenish the red blood cells lost during the donation.
            Red blood cells carry oxygen throughout your body and take approximately <strong className="text-foreground">90 days</strong> to fully regenerate.
          </p>
          <p>
            Donating more frequently than this interval can lead to iron deficiency and fatigue. The 90-day rule ensures
            both your safety and the quality of the donated blood.
          </p>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 mt-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-foreground font-medium">
              You can donate <strong>up to 4 times per year</strong> (once every 90 days).
              Regular donation helps maintain a stable blood supply for patients in need.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
