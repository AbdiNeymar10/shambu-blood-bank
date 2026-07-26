"use server";

import { createClient } from "@/lib/supabase/server";

const WHOLE_BLOOD_INTERVAL_DAYS = 90;

export type EligibilityInfo = {
  /** Donor has at least one completed donation on record */
  hasDonationHistory: boolean;
  lastDonationDate: string | null;       // ISO date string e.g. "2026-04-27"
  lastDonationFormatted: string | null;  // "April 27, 2026"
  nextEligibleDate: string | null;       // ISO date string
  nextEligibleFormatted: string | null;  // "July 26, 2026"
  daysRemaining: number;                 // 0 if eligible, positive if not
  isEligible: boolean;
  /** Progress 0-100 from last donation toward eligibility */
  progressPercent: number;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffInDays(a: Date, b: Date): number {
  return Math.ceil((b.getTime() - a.getTime()) / 86_400_000);
}

function fmt(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function toISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// Main action
// ---------------------------------------------------------------------------
export async function getEligibilityInfo(): Promise<EligibilityInfo | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get public.users id
  const { data: userRow } = await supabase
    .from("users").select("id").eq("auth_id", user.id).maybeSingle();
  const userId = (userRow as { id?: string } | null)?.id;
  if (!userId) return null;

  // Get donor profile (contains next_eligible_date & last_donation_date set by server)
  const { data: profileRow } = await supabase
    .from("donor_profiles")
    .select("id, last_donation_date, next_eligible_date")
    .eq("user_id", userId)
    .maybeSingle();

  const profile = profileRow as {
    id?: string;
    last_donation_date?: string | null;
    next_eligible_date?: string | null;
  } | null;

  const donorProfileId = profile?.id;

  // Also query the most recent COMPLETED donation directly (source of truth)
  let lastDonationDateRaw: string | null = profile?.last_donation_date ?? null;

  if (donorProfileId) {
    const { data: latestDonation } = await supabase
      .from("blood_donations")
      .select("donation_date")
      .eq("donor_id", donorProfileId)
      .eq("status", "completed")
      .order("donation_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    const donation = latestDonation as { donation_date?: string } | null;
    if (donation?.donation_date) {
      lastDonationDateRaw = donation.donation_date;
    }
  }

  // Calculate eligibility
  if (!lastDonationDateRaw) {
    return {
      hasDonationHistory: false,
      lastDonationDate: null,
      lastDonationFormatted: null,
      nextEligibleDate: null,
      nextEligibleFormatted: null,
      daysRemaining: 0,
      isEligible: true,   // first-time donor — eligible
      progressPercent: 100,
    };
  }

  const lastDate = new Date(lastDonationDateRaw);
  const nextDate = addDays(lastDate, WHOLE_BLOOD_INTERVAL_DAYS);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isEligible = today >= nextDate;
  const daysRemaining = isEligible ? 0 : diffInDays(today, nextDate);
  const daysSinceDonation = diffInDays(lastDate, today);
  const progressPercent = Math.min(
    100,
    Math.round((daysSinceDonation / WHOLE_BLOOD_INTERVAL_DAYS) * 100)
  );

  return {
    hasDonationHistory: true,
    lastDonationDate: toISO(lastDate),
    lastDonationFormatted: fmt(lastDate),
    nextEligibleDate: toISO(nextDate),
    nextEligibleFormatted: fmt(nextDate),
    daysRemaining,
    isEligible,
    progressPercent,
  };
}
