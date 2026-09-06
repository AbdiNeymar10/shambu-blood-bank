"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { BloodGroup, AppointmentStatus } from "@/types/database.types";
import { parseDateTime } from "@/lib/utils";

export type DonateRegistrationInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodType?: string;
};

export type RegisterDonorAppointmentResult = {
  success: boolean;
  email?: string;
  fullName?: string;
  centerName?: string;
  dateFormatted?: string;
  timeFormatted?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export type CenterOption = {
  id: string;
  name: string;
  address: string;
  city: string;
};

const VALID_BLOOD_GROUPS: BloodGroup[] = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

/**
  * Checks if an email already belongs to an existing user/donor account in Supabase.
  */
export async function checkEmailExists(email: string): Promise<{ exists: boolean; error?: string }> {
  try {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) return { exists: false };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    // Check public.users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existingUser?.id) {
      return { exists: true };
    }

    // Also check auth.users via admin API
    try {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      if (authUsers?.users?.some((u: any) => u.email?.toLowerCase() === cleanEmail)) {
        return { exists: true };
      }
    } catch {
      // Ignore admin listUsers permission fallback
    }

    return { exists: false };
  } catch (err) {
    console.error("Error in checkEmailExists:", err);
    return { exists: false };
  }
}

/**
  * Fetches available collection centers / hospitals from database.
  */
export async function getDonationCenters(): Promise<CenterOption[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data } = await supabase
      .from("hospitals")
      .select("id, name, address, city")
      .order("name", { ascending: true });

    if (data && data.length > 0) {
      return data as CenterOption[];
    }

    // Default fallback if no centers found
    return [
      {
        id: "default-center",
        name: "Shambu Blood Bank Main Center",
        address: "Main Street, Shambu",
        city: "Shambu",
      },
    ];
  } catch {
    return [
      {
        id: "default-center",
        name: "Shambu Blood Bank Main Center",
        address: "Main Street, Shambu",
        city: "Shambu",
      },
    ];
  }
}

/**
  * Registers a NEW donor with Supabase Auth, creates DB profile, and confirms their selected appointment.
  */
export async function registerNewDonorAndBookAppointment(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodType?: string;
  password: string;
  hospitalId: string;
  date: string;
  time?: string;
}): Promise<RegisterDonorAppointmentResult> {
  try {
    const firstName = (input.firstName || "").trim();
    const lastName = (input.lastName || "").trim();
    const email = (input.email || "").trim().toLowerCase();
    const phone = (input.phone || "").trim();
    const password = input.password;
    const rawBloodType = (input.bloodType || "").trim();
    const fullName = `${firstName} ${lastName}`.trim();

    if (!email || !password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    // 1. Create Auth user in Supabase Auth via admin client
    let authId: string | null = null;

    const { data: newUserAuth, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: "donor",
      },
    });

    if (authErr) {
      if (authErr.message?.toLowerCase().includes("already registered") || authErr.message?.toLowerCase().includes("already exists")) {
        return {
          success: false,
          error: "An account already exists with this email address. Please log in to continue.",
        };
      }
      console.error("Error creating Auth user:", authErr);
      return { success: false, error: authErr.message || "Failed to create donor account." };
    }

    authId = newUserAuth?.user?.id || null;

    if (!authId) {
      return { success: false, error: "Account creation failed. Please try again." };
    }

    // 2. Create or link public.users row
    let userId: string | null = null;
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser?.id) {
      userId = existingUser.id;
      await supabase.from("users").update({ auth_id: authId, phone, full_name: fullName }).eq("id", userId);
    } else {
      const { data: createdUser, error: userErr } = await supabase
        .from("users")
        .insert({
          auth_id: authId,
          email,
          full_name: fullName,
          phone: phone || null,
          role: "donor",
          is_active: true,
        })
        .select("id")
        .single();

      if (userErr) {
        console.error("Error creating public.users record:", userErr);
      }
      userId = createdUser?.id || null;
    }

    if (!userId) {
      return { success: false, error: "Failed to initialize donor user profile." };
    }

    // 3. Create or link donor_profiles row
    let donorProfileId: string | null = null;
    const bloodGroupValue: BloodGroup = VALID_BLOOD_GROUPS.includes(rawBloodType as BloodGroup)
      ? (rawBloodType as BloodGroup)
      : "O+";

    const { data: existingProfile } = await supabase
      .from("donor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingProfile?.id) {
      donorProfileId = existingProfile.id;
    } else {
      const { data: newProfile, error: profileErr } = await supabase
        .from("donor_profiles")
        .insert({
          user_id: userId,
          blood_group: bloodGroupValue,
          date_of_birth: "1998-01-01",
          city: "Shambu",
          is_available: true,
        })
        .select("id")
        .single();

      if (profileErr) {
        console.error("Error creating donor_profiles record:", profileErr);
      }
      donorProfileId = newProfile?.id || null;
    }

    if (!donorProfileId) {
      return { success: false, error: "Failed to initialize donor profile." };
    }

    // 4. Resolve hospital / center
    let hospitalId = input.hospitalId;
    if (!hospitalId || hospitalId === "default-center") {
      const { data: defaultHospitals } = await supabase.from("hospitals").select("id").limit(1);
      if (defaultHospitals && defaultHospitals.length > 0) {
        hospitalId = defaultHospitals[0].id;
      } else {
        const { data: createdHosp } = await supabase
          .from("hospitals")
          .insert({
            name: "Shambu Blood Bank Main Center",
            code: "HOSP-001",
            phone: phone || "+251911000000",
            address: "Main St, Shambu",
            city: "Shambu",
            is_verified: true,
          })
          .select("id")
          .single();
        hospitalId = createdHosp?.id || null;
      }
    }

    if (!hospitalId) {
      return { success: false, error: "Could not locate donation center." };
    }

    // 5. Fetch hospital details for confirmation display
    const { data: hospitalObj } = await supabase
      .from("hospitals")
      .select("name")
      .eq("id", hospitalId)
      .maybeSingle();

    const centerName = hospitalObj?.name || "Shambu Blood Bank Center";

    // 6. Create appointment
    const apptDateObj = parseDateTime(input.date, input.time);
    const dateFormatted = apptDateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const timeFormatted = apptDateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const apptStatus: AppointmentStatus = "scheduled";
    const notesText = `Public donation registration. Name: ${fullName}, Phone: ${phone}, Email: ${email}, Blood Type: ${rawBloodType || "Unknown"}`;

    const { error: apptError } = await supabase
      .from("appointments")
      .insert({
        donor_id: donorProfileId,
        hospital_id: hospitalId,
        appointment_date: apptDateObj.toISOString(),
        status: apptStatus,
        notes: notesText,
      });

    if (apptError) {
      console.error("Error creating appointment:", apptError);
      return { success: false, error: "Failed to confirm appointment: " + apptError.message };
    }

    try {
      revalidatePath("/admin/appointments");
      revalidatePath("/donor/appointments");
    } catch {}

    return {
      success: true,
      email,
      fullName,
      centerName,
      dateFormatted,
      timeFormatted,
    };
  } catch (err: any) {
    console.error("Error in registerNewDonorAndBookAppointment:", err);
    return { success: false, error: err?.message || "An unexpected error occurred during booking." };
  }
}

/**
  * Confirms appointment for an existing / authenticated donor.
  */
export async function bookAppointmentForExistingUser(input: {
  email: string;
  hospitalId: string;
  date: string;
  time?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bloodType?: string;
}): Promise<RegisterDonorAppointmentResult> {
  try {
    const cleanEmail = (input.email || "").trim().toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    let userId: string | null = null;
    let fullName = `${input.firstName || ""} ${input.lastName || ""}`.trim();

    const { data: userRow } = await supabase
      .from("users")
      .select("id, full_name, phone")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (userRow?.id) {
      userId = userRow.id;
      if (userRow.full_name) fullName = userRow.full_name;
    } else {
      // Check server session if logged in
      const clientSupabase = await createClient();
      const { data: { user } } = await clientSupabase.auth.getUser();
      if (user) {
        const { data: sessionUserRow } = await supabase
          .from("users")
          .select("id, full_name")
          .eq("auth_id", user.id)
          .maybeSingle();
        if (sessionUserRow?.id) {
          userId = sessionUserRow.id;
          if (sessionUserRow.full_name) fullName = sessionUserRow.full_name;
        }
      }
    }

    if (!userId) {
      return { success: false, error: "User profile not found. Please log in to continue." };
    }

    // Resolve donor_profile
    let donorProfileId: string | null = null;
    const { data: profile } = await supabase
      .from("donor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (profile?.id) {
      donorProfileId = profile.id;
    } else {
      const rawBloodType = (input.bloodType || "").trim();
      const bloodGroupValue: BloodGroup = VALID_BLOOD_GROUPS.includes(rawBloodType as BloodGroup)
        ? (rawBloodType as BloodGroup)
        : "O+";

      const { data: newProfile } = await supabase
        .from("donor_profiles")
        .insert({
          user_id: userId,
          blood_group: bloodGroupValue,
          date_of_birth: "1998-01-01",
          city: "Shambu",
          is_available: true,
        })
        .select("id")
        .single();

      donorProfileId = newProfile?.id || null;
    }

    if (!donorProfileId) {
      return { success: false, error: "Donor profile could not be found." };
    }

    // Resolve hospital
    let hospitalId = input.hospitalId;
    if (!hospitalId || hospitalId === "default-center") {
      const { data: defaultHospitals } = await supabase.from("hospitals").select("id").limit(1);
      hospitalId = defaultHospitals?.[0]?.id;
    }

    if (!hospitalId) {
      return { success: false, error: "Selected collection center not found." };
    }

    const { data: hospitalObj } = await supabase
      .from("hospitals")
      .select("name")
      .eq("id", hospitalId)
      .maybeSingle();

    const centerName = hospitalObj?.name || "Shambu Blood Bank Center";

    const apptDateObj = parseDateTime(input.date, input.time);
    const dateFormatted = apptDateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const timeFormatted = apptDateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const { error: apptError } = await supabase.from("appointments").insert({
      donor_id: donorProfileId,
      hospital_id: hospitalId,
      appointment_date: apptDateObj.toISOString(),
      status: "scheduled",
      notes: `Appointment booked online by donor ${fullName}`,
    });

    if (apptError) {
      return { success: false, error: "Failed to schedule appointment: " + apptError.message };
    }

    try {
      revalidatePath("/admin/appointments");
      revalidatePath("/donor/appointments");
    } catch {}

    return {
      success: true,
      email: cleanEmail,
      fullName: fullName || "Donor User",
      centerName,
      dateFormatted,
      timeFormatted,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error scheduling appointment." };
  }
}

/**
  * Legacy fallback function for public appointment registration.
  */
export async function registerDonorAppointment(
  input: DonateRegistrationInput
): Promise<RegisterDonorAppointmentResult> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  return bookAppointmentForExistingUser({
    ...input,
    hospitalId: "default-center",
    date: dateStr,
    time: "09:00",
  });
}
