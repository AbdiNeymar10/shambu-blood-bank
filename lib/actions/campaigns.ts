"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CampaignStatus = "upcoming" | "active" | "completed" | "cancelled";
export type RegistrationStatus = "registered" | "cancelled" | "attended";

export type CampaignRecord = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  location: string;
  startDate: string;
  endDate: string;
  formattedDates: string;
  targetUnits: number;
  collectedUnits: number;
  status: CampaignStatus;
  imageUrl?: string;
  registrationCount: number;
  availableSlots: number;
};

export type RegistrationRecord = {
  id: string;
  campaignId: string;
  donorId: string;
  status: RegistrationStatus;
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  if (s.getFullYear() === e.getFullYear()) {
    if (s.getMonth() === e.getMonth()) {
      return `${s.toLocaleDateString("en-US", { month: "long" })} ${s.getDate()} \u2013 ${e.getDate()}, ${s.getFullYear()}`;
    }
    return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })} \u2013 ${e.toLocaleDateString("en-US", { month: "long", day: "numeric" })}, ${s.getFullYear()}`;
  }
  return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} \u2013 ${e.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
}

async function getDonorProfileId(): Promise<string | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userRow } = await supabase.from("users").select("id").eq("auth_id", user.id).maybeSingle();
  const userId = (userRow as { id?: string } | null)?.id;
  if (!userId) return null;

  const { data: profileRow } = await supabase.from("donor_profiles").select("id").eq("user_id", userId).maybeSingle();
  let donorProfileId = (profileRow as { id?: string } | null)?.id ?? null;

  if (!donorProfileId) {
    const { data: newProfile } = await supabase
      .from("donor_profiles")
      .upsert([{ user_id: userId, blood_group: "O+", date_of_birth: "1995-01-01", city: "Shambu" }], { onConflict: "user_id" })
      .select("id")
      .maybeSingle();
    donorProfileId = (newProfile as { id?: string } | null)?.id ?? null;
  }

  return donorProfileId;
}

// ---------------------------------------------------------------------------
// Fetch campaigns visible to donors (active + upcoming)
// ---------------------------------------------------------------------------
export async function getDonorCampaigns(): Promise<{
  campaigns: CampaignRecord[];
  myRegistrations: Record<string, RegistrationRecord>;
  donorProfileId: string | null;
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;

  const { data: camps, error: campsError } = await supabase
    .from("campaigns")
    .select("id, title, slug, description, location, start_date, end_date, target_units, collected_units, status, image_url")
    .in("status", ["active", "upcoming"])
    .order("start_date", { ascending: true });

  if (campsError || !camps) {
    return { campaigns: [], myRegistrations: {}, donorProfileId: null };
  }

  const campaignIds: string[] = camps.map((c: { id: string }) => c.id);

  // Get registration counts
  const countMap: Record<string, number> = {};
  if (campaignIds.length > 0) {
    const { data: regCounts } = await supabase
      .from("campaign_registrations")
      .select("campaign_id")
      .in("campaign_id", campaignIds)
      .eq("status", "registered");
    if (regCounts) {
      for (const row of regCounts as { campaign_id: string }[]) {
        countMap[row.campaign_id] = (countMap[row.campaign_id] ?? 0) + 1;
      }
    }
  }

  const campaigns: CampaignRecord[] = camps.map((c: {
    id: string; title: string; slug: string; description?: string;
    location: string; start_date: string; end_date: string;
    target_units: number; collected_units: number; status: CampaignStatus; image_url?: string;
  }) => {
    const regCount = countMap[c.id] ?? 0;
    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      location: c.location,
      startDate: c.start_date,
      endDate: c.end_date,
      formattedDates: formatDateRange(c.start_date, c.end_date),
      targetUnits: c.target_units,
      collectedUnits: c.collected_units,
      status: c.status,
      imageUrl: c.image_url,
      registrationCount: regCount,
      availableSlots: Math.max(0, c.target_units - regCount),
    };
  });

  const donorProfileId = await getDonorProfileId();

  const myRegistrations: Record<string, RegistrationRecord> = {};
  if (donorProfileId && campaignIds.length > 0) {
    const { data: myRegs } = await supabase
      .from("campaign_registrations")
      .select("id, campaign_id, donor_id, status, created_at")
      .eq("donor_id", donorProfileId)
      .in("campaign_id", campaignIds);
    if (myRegs) {
      for (const r of myRegs as { id: string; campaign_id: string; donor_id: string; status: RegistrationStatus; created_at: string }[]) {
        myRegistrations[r.campaign_id] = { id: r.id, campaignId: r.campaign_id, donorId: r.donor_id, status: r.status, createdAt: r.created_at };
      }
    }
  }

  return { campaigns, myRegistrations, donorProfileId };
}

// ---------------------------------------------------------------------------
// Register for a campaign
// ---------------------------------------------------------------------------
export async function registerForCampaign(
  campaignId: string
): Promise<{ success: boolean; error?: string }> {
  if (!campaignId) return { success: false, error: "Campaign ID is required." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const donorProfileId = await getDonorProfileId();
  if (!donorProfileId) return { success: false, error: "Donor profile not found. Please complete registration." };

  // Check for duplicate
  const { data: existing } = await supabase
    .from("campaign_registrations")
    .select("id, status")
    .eq("campaign_id", campaignId)
    .eq("donor_id", donorProfileId)
    .maybeSingle();

  const existingReg = existing as { id: string; status: string } | null;

  if (existingReg?.status === "registered") {
    return { success: false, error: "You are already registered for this campaign." };
  }

  // Re-activate a previously cancelled registration
  if (existingReg?.status === "cancelled") {
    const { error: updateErr } = await supabase
      .from("campaign_registrations")
      .update({ status: "registered", updated_at: new Date().toISOString() })
      .eq("id", existingReg.id);
    if (updateErr) return { success: false, error: updateErr.message || "Failed to re-register." };
    revalidatePath("/donor/campaigns");
    return { success: true };
  }

  const { error: insertErr } = await supabase
    .from("campaign_registrations")
    .insert([{ campaign_id: campaignId, donor_id: donorProfileId, status: "registered" }]);

  if (insertErr) {
    if (insertErr.code === "23505") return { success: false, error: "You are already registered for this campaign." };
    return { success: false, error: insertErr.message || "Registration failed." };
  }

  revalidatePath("/donor/campaigns");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Cancel a campaign registration
// ---------------------------------------------------------------------------
export async function cancelCampaignRegistration(
  registrationId: string
): Promise<{ success: boolean; error?: string }> {
  if (!registrationId) return { success: false, error: "Registration ID is required." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("campaign_registrations")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", registrationId);

  if (error) return { success: false, error: error.message || "Failed to cancel registration." };

  revalidatePath("/donor/campaigns");
  return { success: true };
}
