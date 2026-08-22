"use server";

import { createAdminClient } from "@/lib/supabase/server";
import type { BloodGroup, AppointmentStatus } from "@/types/database.types";

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
  error?: string;
  fieldErrors?: Record<string, string>;
};

const VALID_BLOOD_GROUPS: BloodGroup[] = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

/**
 * Registers a donor and schedules an appointment in Supabase from the public Donate page.
 */
export async function registerDonorAppointment(
  input: DonateRegistrationInput
): Promise<RegisterDonorAppointmentResult> {
  try {
    const fieldErrors: Record<string, string> = {};

    const firstName = (input.firstName || "").trim();
    const lastName = (input.lastName || "").trim();
    const email = (input.email || "").trim().toLowerCase();
    const phone = (input.phone || "").trim();
    const rawBloodType = (input.bloodType || "").trim();

    if (!firstName) fieldErrors.firstName = "First name is required";
    if (!lastName) fieldErrors.lastName = "Last name is required";
    if (!email) {
      fieldErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = "Please enter a valid email address";
    }
    if (!phone) fieldErrors.phone = "Phone number is required";

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Please check your information and try again.",
        fieldErrors,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const fullName = `${firstName} ${lastName}`.trim();

    // 1. Find or create user in public.users
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
          email: email,
          full_name: fullName,
          phone: phone,
          role: "donor",
          is_active: true,
        })
        .select("id")
        .single();

      if (userErr) {
        console.error("Error creating user for donor:", userErr);
      }
      userId = newUser?.id || null;
    }

    if (!userId) {
      return {
        success: false,
        error: "We couldn't process your registration right now. Please try again.",
      };
    }

    // 2. Find or create donor profile in public.donor_profiles
    let donorProfileId: string | null = null;
    const bloodGroupValue: BloodGroup =
      VALID_BLOOD_GROUPS.includes(rawBloodType as BloodGroup)
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
        console.error("Error creating donor profile:", profileErr);
      }
      donorProfileId = newProfile?.id || null;
    }

    if (!donorProfileId) {
      return {
        success: false,
        error: "We couldn't process your donor profile right now. Please try again.",
      };
    }

    // 3. Find or create hospital location
    let hospitalId: string | null = null;
    const { data: defaultHospitals } = await supabase
      .from("hospitals")
      .select("id")
      .limit(1);

    if (defaultHospitals && defaultHospitals.length > 0) {
      hospitalId = defaultHospitals[0].id;
    } else {
      const hospitalCode = `HOSP-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: createdHosp } = await supabase
        .from("hospitals")
        .insert({
          name: "Shambu Blood Bank Center",
          code: hospitalCode,
          phone: phone || "+251911000000",
          address: "Main St, Shambu",
          city: "Shambu",
          is_verified: true,
        })
        .select("id")
        .single();

      hospitalId = createdHosp?.id || null;
    }

    if (!hospitalId) {
      return {
        success: false,
        error: "We couldn't process your appointment location right now. Please try again.",
      };
    }

    // 4. Create appointment in public.appointments
    const appointmentDateObj = new Date();
    appointmentDateObj.setDate(appointmentDateObj.getDate() + 1);
    appointmentDateObj.setHours(9, 0, 0, 0);

    const apptStatus: AppointmentStatus = "scheduled";
    const notesText = `Public donation registration. Name: ${fullName}, Phone: ${phone}, Email: ${email}, Blood Type: ${rawBloodType || "Unknown"}`;

    const { error: apptError } = await supabase
      .from("appointments")
      .insert({
        donor_id: donorProfileId,
        hospital_id: hospitalId,
        appointment_date: appointmentDateObj.toISOString(),
        status: apptStatus,
        notes: notesText,
      });

    if (apptError) {
      console.error("Error inserting appointment into Supabase:", apptError);
      return {
        success: false,
        error: "We couldn't schedule your appointment right now. Please check your information and try again.",
      };
    }

    return {
      success: true,
      email,
      fullName,
    };
  } catch (err) {
    console.error("Unexpected error in registerDonorAppointment:", err);
    return {
      success: false,
      error: "We couldn't process your registration right now. Please try again.",
    };
  }
}
