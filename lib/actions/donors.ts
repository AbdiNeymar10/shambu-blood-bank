"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { BloodGroup } from "@/types/database.types";

export type DonorTableItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  city: string;
  status: "Available" | "Deferred" | "Unavailable";
  lastDonated: string;
  totalDonations: number;
};

export type AdminDonorsData = {
  stats: {
    totalDonors: number;
    eligibleAndAvailable: number;
    recentlyDonated: number;
  };
  donors: DonorTableItem[];
};

export type DonorProfileDetails = {
  donor: DonorTableItem;
  donations: Array<{
    id: string;
    unitsDonated: number;
    donationDate: string;
    status: string;
    hospitalName?: string;
  }>;
};

/**
 * Fetches summary statistics and all registered donors for the Admin Donor Management page.
 */
export async function getAdminDonorsData(): Promise<AdminDonorsData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const [donorsRes, donationsRes] = await Promise.all([
      supabase
        .from("donor_profiles")
        .select("id, blood_group, city, is_available, last_donation_date, created_at, user_id, users(id, full_name, phone, email)")
        .order("created_at", { ascending: false }),

      supabase
        .from("blood_donations")
        .select("id, donor_id, units_donated, donation_date, status")
        .eq("status", "completed"),
    ]);

    const donorRows = donorsRes.data || [];
    const donationRows = donationsRes.data || [];

    // Aggregate total units donated & latest donation date per donor
    const totalsMap: Record<string, number> = {};
    const lastDateMap: Record<string, Date> = {};

    donationRows.forEach((donation: any) => {
      const donorId = donation.donor_id;
      const units = donation.units_donated || 1;
      totalsMap[donorId] = (totalsMap[donorId] || 0) + units;

      if (donation.donation_date) {
        const dDate = new Date(donation.donation_date);
        if (!lastDateMap[donorId] || dDate > lastDateMap[donorId]) {
          lastDateMap[donorId] = dDate;
        }
      }
    });

    const fiftySixDaysAgo = new Date();
    fiftySixDaysAgo.setDate(fiftySixDaysAgo.getDate() - 56);

    let totalDonors = donorRows.length;
    let eligibleAndAvailable = 0;
    let recentlyDonated = 0;

    const donors: DonorTableItem[] = donorRows.map((row: any) => {
      const user = Array.isArray(row.users) ? row.users[0] : row.users;
      const donorId = row.id;

      // Determine latest donation date
      let lastDate: Date | null = lastDateMap[donorId] || null;
      if (!lastDate && row.last_donation_date) {
        lastDate = new Date(row.last_donation_date);
      }

      const totalDonations = totalsMap[donorId] || 0;
      const lastDonatedStr = lastDate ? lastDate.toISOString().split("T")[0] : "Never";

      // Evaluate availability & eligibility (56 days interval)
      let status: "Available" | "Deferred" | "Unavailable" = "Available";
      const isRecent = lastDate ? lastDate >= fiftySixDaysAgo : false;

      if (isRecent) {
        recentlyDonated++;
      }

      if (row.is_available === false) {
        status = "Unavailable";
      } else if (isRecent) {
        status = "Deferred";
      } else {
        status = "Available";
        eligibleAndAvailable++;
      }

      return {
        id: donorId,
        name: user?.full_name || "Unknown Donor",
        email: user?.email || "N/A",
        phone: user?.phone || "N/A",
        bloodGroup: row.blood_group || "O+",
        city: row.city || "Shambu",
        status,
        lastDonated: lastDonatedStr,
        totalDonations,
      };
    });

    return {
      stats: {
        totalDonors,
        eligibleAndAvailable,
        recentlyDonated,
      },
      donors,
    };
  } catch (error) {
    console.error("Error fetching admin donors data from Supabase:", error);
    return {
      stats: {
        totalDonors: 0,
        eligibleAndAvailable: 0,
        recentlyDonated: 0,
      },
      donors: [],
    };
  }
}

/**
 * Registers a new donor user and profile in Supabase using createAdminClient.
 */
export async function registerAdminDonor(input: {
  fullName: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  city?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const email = input.email.trim().toLowerCase();
    const fullName = input.fullName.trim();
    const phone = input.phone.trim();

    if (!fullName || !email || !phone) {
      return { success: false, error: "Please enter full name, email, and phone number." };
    }

    // 1. Check or create user in public.users
    let userId: string | null = null;
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser?.id) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: userErr } = await supabase
        .from("users")
        .insert({
          email,
          full_name: fullName,
          phone,
          role: "donor",
          is_active: true,
        })
        .select("id")
        .single();

      if (userErr || !newUser?.id) {
        console.error("Error creating user for donor:", userErr);
        return { success: false, error: "Failed to create donor user record." };
      }
      userId = newUser.id;
    }

    // 2. Check or create donor profile in public.donor_profiles
    const { data: existingProfile } = await supabase
      .from("donor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingProfile?.id) {
      return { success: false, error: "A donor profile already exists for this email address." };
    }

    const { error: profileErr } = await supabase.from("donor_profiles").insert({
      user_id: userId,
      blood_group: input.bloodGroup,
      city: input.city || "Shambu",
      date_of_birth: "1998-01-01",
      is_available: true,
    });

    if (profileErr) {
      console.error("Error creating donor profile:", profileErr);
      return { success: false, error: "Failed to create donor profile." };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in registerAdminDonor:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Fetches full profile details and donation history for a single donor.
 */
export async function getDonorProfileDetails(donorProfileId: string): Promise<DonorProfileDetails | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const [donorRes, historyRes] = await Promise.all([
      supabase
        .from("donor_profiles")
        .select("id, blood_group, city, is_available, last_donation_date, created_at, user_id, users(id, full_name, phone, email)")
        .eq("id", donorProfileId)
        .single(),

      supabase
        .from("blood_donations")
        .select("id, units_donated, donation_date, status, hospitals(name)")
        .eq("donor_id", donorProfileId)
        .order("donation_date", { ascending: false }),
    ]);

    if (!donorRes.data) return null;
    const row = donorRes.data;
    const user = Array.isArray(row.users) ? row.users[0] : row.users;

    const history = (historyRes.data || []).map((h: any) => {
      const hosp = Array.isArray(h.hospitals) ? h.hospitals[0] : h.hospitals;
      return {
        id: h.id,
        unitsDonated: h.units_donated || 1,
        donationDate: h.donation_date ? new Date(h.donation_date).toISOString().split("T")[0] : "N/A",
        status: (h.status || "completed").toUpperCase(),
        hospitalName: hosp?.name || "Shambu Blood Bank Center",
      };
    });

    const totalUnits = history.reduce((acc: number, item: any) => acc + item.unitsDonated, 0);
    const lastDonatedStr = history.length > 0 ? history[0].donationDate : "Never";

    const fiftySixDaysAgo = new Date();
    fiftySixDaysAgo.setDate(fiftySixDaysAgo.getDate() - 56);

    let status: "Available" | "Deferred" | "Unavailable" = "Available";
    if (row.is_available === false) {
      status = "Unavailable";
    } else if (history.length > 0 && new Date(history[0].donationDate) >= fiftySixDaysAgo) {
      status = "Deferred";
    }

    return {
      donor: {
        id: row.id,
        name: user?.full_name || "Unknown Donor",
        email: user?.email || "N/A",
        phone: user?.phone || "N/A",
        bloodGroup: row.blood_group || "O+",
        city: row.city || "Shambu",
        status,
        lastDonated: lastDonatedStr,
        totalDonations: totalUnits,
      },
      donations: history,
    };
  } catch (err) {
    console.error("Error fetching donor profile details:", err);
    return null;
  }
}
