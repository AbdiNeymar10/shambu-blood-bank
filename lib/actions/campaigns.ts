"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

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

export type AdminCampaignCard = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  location: string;
  startDate: string;
  endDate: string;
  targetUnits: number;
  collectedUnits: number;
  registeredDonors: number;
  progress: number;
  status: "Active" | "Upcoming" | "Completed";
  hospitalName?: string;
  imageUrl?: string;
};

export type CampaignVolunteerItem = {
  id: string;
  name: string;
  phone: string;
  email: string;
  bloodGroup: string;
  registeredAt: string;
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
// Donor Portal Actions
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

  const campaigns: CampaignRecord[] = camps.map((c: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    location: string;
    start_date: string;
    end_date: string;
    target_units: number;
    collected_units: number;
    status: CampaignStatus;
    image_url: string | null;
  }) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description ?? undefined,
    location: c.location,
    startDate: c.start_date,
    endDate: c.end_date,
    formattedDates: formatDateRange(c.start_date, c.end_date),
    targetUnits: c.target_units ?? 100,
    collectedUnits: c.collected_units ?? 0,
    status: c.status,
    imageUrl: c.image_url ?? undefined,
    registrationCount: 0,
    availableSlots: Math.max(0, (c.target_units ?? 100) - (c.collected_units ?? 0)),
  }));

  return { campaigns, myRegistrations, donorProfileId };
}

export async function registerForCampaign(
  campaignId: string
): Promise<{ success: boolean; error?: string }> {
  if (!campaignId) return { success: false, error: "Campaign ID is required." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const donorProfileId = await getDonorProfileId();
  if (!donorProfileId) return { success: false, error: "Donor profile not found. Please complete registration." };

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

// ---------------------------------------------------------------------------
// Admin Portal Actions
// ---------------------------------------------------------------------------

export async function getAdminCampaignsData(): Promise<AdminCampaignCard[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const [campsRes, regsRes] = await Promise.all([
      supabase
        .from("campaigns")
        .select("id, title, slug, description, location, start_date, end_date, target_units, collected_units, status, image_url, hospital_id, hospitals(name)")
        .order("start_date", { ascending: true }),

      supabase
        .from("campaign_registrations")
        .select("id, campaign_id, status")
        .neq("status", "cancelled"),
    ]);

    const camps = campsRes.data || [];
    const regs = regsRes.data || [];

    const regsCountMap: Record<string, number> = {};
    regs.forEach((r: any) => {
      regsCountMap[r.campaign_id] = (regsCountMap[r.campaign_id] || 0) + 1;
    });

    const now = new Date();

    const campaignList: AdminCampaignCard[] = camps.map((c: any) => {
      const sDateObj = new Date(c.start_date);
      const eDateObj = new Date(c.end_date);
      eDateObj.setHours(23, 59, 59, 999);

      let dynamicStatus: "Active" | "Upcoming" | "Completed" = "Upcoming";
      if (now >= sDateObj && now <= eDateObj) {
        dynamicStatus = "Active";
      } else if (now > eDateObj) {
        dynamicStatus = "Completed";
      } else {
        dynamicStatus = "Upcoming";
      }

      const registeredCount = regsCountMap[c.id] || 0;
      const target = c.target_units || 100;
      const progress = Math.min(100, Math.round((registeredCount / target) * 100));
      const hospObj = Array.isArray(c.hospitals) ? c.hospitals[0] : c.hospitals;

      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        location: c.location || hospObj?.name || "Shambu Center",
        startDate: c.start_date ? c.start_date.split("T")[0] : "",
        endDate: c.end_date ? c.end_date.split("T")[0] : "",
        targetUnits: target,
        collectedUnits: c.collected_units || 0,
        registeredDonors: registeredCount,
        progress,
        status: dynamicStatus,
        hospitalName: hospObj?.name,
        imageUrl: c.image_url || undefined,
      };
    });

    // Dynamic ordering: Active (1) -> Upcoming (2) -> Completed (3)
    campaignList.sort((a, b) => {
      const order = { Active: 1, Upcoming: 2, Completed: 3 };
      if (order[a.status] !== order[b.status]) {
        return order[a.status] - order[b.status];
      }
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });

    return campaignList;
  } catch (err) {
    console.error("Error fetching admin campaigns data:", err);
    return [];
  }
}

export async function createAdminCampaign(input: {
  title: string;
  description?: string;
  location: string;
  startDate: string;
  endDate: string;
  targetUnits: number;
  imageUrl?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const title = (input.title || "").trim();
    const location = (input.location || "").trim();
    const startDateStr = (input.startDate || "").trim();
    const endDateStr = (input.endDate || "").trim();
    const targetUnits = input.targetUnits || 100;

    if (!title || !location || !startDateStr || !endDateStr) {
      return { success: false, error: "Please enter campaign title, location, start date, and end date." };
    }

    const sDateObj = new Date(startDateStr);
    const eDateObj = new Date(endDateStr);
    if (isNaN(sDateObj.getTime()) || isNaN(eDateObj.getTime())) {
      return { success: false, error: "Invalid start date or end date format." };
    }

    if (eDateObj < sDateObj) {
      return { success: false, error: "End date cannot be before start date." };
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    const now = new Date();
    let statusVal: CampaignStatus = "upcoming";
    if (now >= sDateObj && now <= eDateObj) {
      statusVal = "active";
    } else if (now > eDateObj) {
      statusVal = "completed";
    }

    const { error: insertErr } = await supabase.from("campaigns").insert({
      title,
      slug,
      description: input.description || null,
      location,
      start_date: sDateObj.toISOString(),
      end_date: eDateObj.toISOString(),
      target_units: targetUnits,
      collected_units: 0,
      status: statusVal,
      image_url: input.imageUrl?.trim() || null,
    });

    if (insertErr) {
      console.error("Error creating campaign:", insertErr);
      return { success: false, error: "Failed to create campaign record." };
    }

    revalidatePath("/admin/campaigns");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in createAdminCampaign:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateAdminCampaign(
  campaignId: string,
  input: {
    title: string;
    description?: string;
    location: string;
    startDate: string;
    endDate: string;
    targetUnits: number;
    imageUrl?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const title = (input.title || "").trim();
    const location = (input.location || "").trim();
    const startDateStr = (input.startDate || "").trim();
    const endDateStr = (input.endDate || "").trim();
    const targetUnits = input.targetUnits || 100;

    if (!title || !location || !startDateStr || !endDateStr) {
      return { success: false, error: "Please enter campaign title, location, start date, and end date." };
    }

    const sDateObj = new Date(startDateStr);
    const eDateObj = new Date(endDateStr);
    if (isNaN(sDateObj.getTime()) || isNaN(eDateObj.getTime())) {
      return { success: false, error: "Invalid start date or end date format." };
    }

    if (eDateObj < sDateObj) {
      return { success: false, error: "End date cannot be before start date." };
    }

    const now = new Date();
    let statusVal: CampaignStatus = "upcoming";
    if (now >= sDateObj && now <= eDateObj) {
      statusVal = "active";
    } else if (now > eDateObj) {
      statusVal = "completed";
    }

    const { error: updateErr } = await supabase
      .from("campaigns")
      .update({
        title,
        description: input.description || null,
        location,
        start_date: sDateObj.toISOString(),
        end_date: eDateObj.toISOString(),
        target_units: targetUnits,
        status: statusVal,
        image_url: input.imageUrl?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    if (updateErr) {
      console.error("Error updating campaign:", updateErr);
      return { success: false, error: "Failed to update campaign record." };
    }

    revalidatePath("/admin/campaigns");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in updateAdminCampaign:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getCampaignDetails(campaignId: string): Promise<{
  campaign: AdminCampaignCard;
  volunteers: CampaignVolunteerItem[];
} | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const [campRes, regsRes] = await Promise.all([
      supabase
        .from("campaigns")
        .select("id, title, slug, description, location, start_date, end_date, target_units, collected_units, status, image_url")
        .eq("id", campaignId)
        .single(),

      supabase
        .from("campaign_registrations")
        .select("id, status, created_at, donor_profiles(id, blood_group, users(full_name, phone, email))")
        .eq("campaign_id", campaignId)
        .neq("status", "cancelled"),
    ]);

    if (!campRes.data) return null;
    const c = campRes.data;

    const now = new Date();
    const sDateObj = new Date(c.start_date);
    const eDateObj = new Date(c.end_date);
    eDateObj.setHours(23, 59, 59, 999);

    let dynamicStatus: "Active" | "Upcoming" | "Completed" = "Upcoming";
    if (now >= sDateObj && now <= eDateObj) {
      dynamicStatus = "Active";
    } else if (now > eDateObj) {
      dynamicStatus = "Completed";
    }

    const volunteers: CampaignVolunteerItem[] = (regsRes.data || []).map((r: any) => {
      const dp = Array.isArray(r.donor_profiles) ? r.donor_profiles[0] : r.donor_profiles;
      const u = dp?.users ? (Array.isArray(dp.users) ? dp.users[0] : dp.users) : null;
      return {
        id: r.id,
        name: u?.full_name || "Anonymous Volunteer",
        phone: u?.phone || "N/A",
        email: u?.email || "N/A",
        bloodGroup: dp?.blood_group || "O+",
        registeredAt: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : "N/A",
      };
    });

    const target = c.target_units || 100;
    const progress = Math.min(100, Math.round((volunteers.length / target) * 100));

    return {
      campaign: {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        location: c.location || "Shambu Center",
        startDate: c.start_date ? c.start_date.split("T")[0] : "",
        endDate: c.end_date ? c.end_date.split("T")[0] : "",
        targetUnits: target,
        collectedUnits: c.collected_units || 0,
        registeredDonors: volunteers.length,
        progress,
        status: dynamicStatus,
        imageUrl: c.image_url || undefined,
      },
      volunteers,
    };
  } catch (err) {
    console.error("Error fetching campaign details:", err);
    return null;
  }
}

export type PublicCampaignItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  formattedDates: string;
  formattedTime: string;
  targetUnits: number;
  status: "Active" | "Upcoming" | "Completed";
  imageUrl: string;
};

/**
 * Fetches all campaigns for public display (events page & homepage preview).
 */
export async function getPublicCampaignsList(): Promise<PublicCampaignItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const { data: camps, error } = await supabase
      .from("campaigns")
      .select("id, title, slug, description, location, start_date, end_date, target_units, image_url")
      .order("start_date", { ascending: true });

    if (error || !camps) return [];

    const now = new Date();

    return camps.map((c: any) => {
      const sDateObj = new Date(c.start_date);
      const eDateObj = new Date(c.end_date);
      eDateObj.setHours(23, 59, 59, 999);

      let dynamicStatus: "Active" | "Upcoming" | "Completed" = "Upcoming";
      if (now >= sDateObj && now <= eDateObj) {
        dynamicStatus = "Active";
      } else if (now > eDateObj) {
        dynamicStatus = "Completed";
      } else {
        dynamicStatus = "Upcoming";
      }

      const formattedDates = formatDateRange(c.start_date, c.end_date);
      const formattedTime = "8:00 AM - 5:00 PM";

      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description || "Join us for our community blood donation drive. Your contribution saves lives.",
        location: c.location || "Shambu Blood Bank Center",
        startDate: c.start_date ? c.start_date.split("T")[0] : "",
        endDate: c.end_date ? c.end_date.split("T")[0] : "",
        formattedDates,
        formattedTime,
        targetUnits: c.target_units || 100,
        status: dynamicStatus,
        imageUrl:
          c.image_url ||
          "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800",
      };
    });
  } catch (err) {
    console.error("Error fetching public campaigns list:", err);
    return [];
  }
}
