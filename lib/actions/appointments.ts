"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AppointmentStatus =
  | "pending"
  | "scheduled"
  | "approved"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected";

export type AppointmentRecord = {
  id: string;
  donorId: string;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress?: string;
  appointmentDate: string;
  formattedDate: string;
  formattedTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  isMock?: boolean;
};

export type HospitalItem = {
  id: string;
  name: string;
  address: string;
  city: string;
};

/** Simple UUID v4 format check */
function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/** Seed data – used to populate the DB if the hospitals table is empty */
const SEED_HOSPITALS = [
  {
    name: "Shambu General Hospital Blood Bank",
    code: "SGH-001",
    phone: "+251577780001",
    address: "Kebele 01, Main Hospital Road",
    city: "Shambu",
    is_verified: true,
  },
  {
    name: "Horo Guduru Primary Health Center",
    code: "HGP-002",
    phone: "+251577780002",
    address: "Central Market Area",
    city: "Shambu",
    is_verified: true,
  },
  {
    name: "Fincha Valley Medical Center",
    code: "FVM-003",
    phone: "+251577780003",
    address: "Fincha Sugar Estate Road",
    city: "Fincha",
    is_verified: true,
  },
];

const MOCK_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: "apt-101",
    donorId: "mock-donor-1",
    hospitalId: "hosp-1",
    hospitalName: "Shambu General Hospital Blood Bank",
    hospitalAddress: "Kebele 01, Main Hospital Road",
    appointmentDate: "2026-08-15T10:00:00Z",
    formattedDate: "August 15, 2026",
    formattedTime: "10:00 AM",
    status: "confirmed",
    notes: "Regular donation slot - 450ml Whole Blood",
    createdAt: new Date().toISOString(),
    isMock: true,
  },
];

/**
 * Fetches available hospitals list for booking
 */
export async function getHospitals(): Promise<HospitalItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = await createClient() as any;

    // 1. Try to fetch existing hospitals
    const { data, error } = await supabase
      .from("hospitals")
      .select("id, name, address, city")
      .eq("is_verified", true)
      .order("name", { ascending: true });

    if (!error && data && data.length > 0) {
      return (data as HospitalItem[]).map((h: HospitalItem) => ({
        id: h.id,
        name: h.name,
        address: h.address || "Shambu Town",
        city: h.city || "Shambu",
      }));
    }

    // 2. Table is empty – seed it so real UUIDs exist
    const { data: seeded, error: seedErr } = await supabase
      .from("hospitals")
      .upsert(SEED_HOSPITALS, { onConflict: "code" })
      .select("id, name, address, city");

    if (!seedErr && seeded && seeded.length > 0) {
      return (seeded as HospitalItem[]).map((h: HospitalItem) => ({
        id: h.id,
        name: h.name,
        address: h.address || "Shambu Town",
        city: h.city || "Shambu",
      }));
    }

    // 3. Seed also failed – return empty so the UI can show a message
    return [];
  } catch {
    return [];
  }
}

/**
 * Fetches appointments for the currently logged-in donor only
 */
export async function getDonorAppointments(): Promise<{
  appointments: AppointmentRecord[];
  usingMock: boolean;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { appointments: MOCK_APPOINTMENTS, usingMock: true };
    }

    // 1. Get user id from public.users
    const { data: userRow } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .maybeSingle();

    const userId = (userRow as { id?: string } | null)?.id;
    if (!userId) {
      return { appointments: MOCK_APPOINTMENTS, usingMock: true };
    }

    // 2. Get donor profile id
    const { data: profileRow } = await supabase
      .from("donor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    const donorProfileId = (profileRow as { id?: string } | null)?.id;
    if (!donorProfileId) {
      return { appointments: MOCK_APPOINTMENTS, usingMock: true };
    }

    // 3. Query appointments for this donor only
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("appointments")
      .select(`
        id,
        donor_id,
        hospital_id,
        appointment_date,
        status,
        notes,
        created_at,
        hospitals ( id, name, address, city )
      `)
      .eq("donor_id", donorProfileId)
      .order("appointment_date", { ascending: false });

    if (error || !data || data.length === 0) {
      return { appointments: MOCK_APPOINTMENTS, usingMock: true };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: AppointmentRecord[] = data.map((item: any) => {
      const dt = new Date(item.appointment_date);
      const formattedDate = isNaN(dt.getTime())
        ? "Invalid Date"
        : dt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
      const formattedTime = isNaN(dt.getTime())
        ? "10:00 AM"
        : dt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

      return {
        id: item.id,
        donorId: item.donor_id,
        hospitalId: item.hospital_id,
        hospitalName:
          item.hospitals?.name || "Shambu General Hospital Blood Bank",
        hospitalAddress: item.hospitals?.address || "Shambu Town",
        appointmentDate: item.appointment_date,
        formattedDate,
        formattedTime,
        status: (item.status || "pending").toLowerCase() as AppointmentStatus,
        notes: item.notes || undefined,
        createdAt: item.created_at,
        isMock: false,
      };
    });

    return { appointments: records, usingMock: false };
  } catch (err) {
    console.error("Error loading donor appointments:", err);
    return { appointments: MOCK_APPOINTMENTS, usingMock: true };
  }
}

/**
 * Creates a new appointment booking for the authenticated donor
 */
export async function createAppointment(
  hospitalId: string,
  dateStr: string,
  timeStr: string,
  notes?: string
): Promise<{ success: boolean; error?: string; appointment?: AppointmentRecord }> {
  if (!hospitalId) {
    return { success: false, error: "Please select a donation center/hospital." };
  }

  // Guard: hospital_id must be a real UUID (not a seed/mock fallback)
  if (!isUUID(hospitalId)) {
    return {
      success: false,
      error:
        "The selected hospital is not yet registered in the system. Please refresh the page and try again.",
    };
  }

  if (!dateStr) {
    return { success: false, error: "Please select an appointment date." };
  }

  if (!timeStr) {
    return { success: false, error: "Please select a time slot." };
  }

  // Combine date and time
  const fullDateTimeStr = `${dateStr}T${timeStr}:00`;
  const bookingDate = new Date(fullDateTimeStr);

  if (isNaN(bookingDate.getTime())) {
    return { success: false, error: "Invalid date or time selected." };
  }

  const now = new Date();
  if (bookingDate < now) {
    return { success: false, error: "Appointment date must be in the future." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be signed in to book an appointment." };
    }

    // Get user id
    const { data: userRow } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .maybeSingle();

    const userId = (userRow as { id?: string } | null)?.id;
    if (!userId) {
      return { success: false, error: "User profile not found. Please complete registration." };
    }

    // Get donor profile id
    const { data: profileRow } = await supabase
      .from("donor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let donorProfileId = (profileRow as { id?: string } | null)?.id;

    // Create donor profile if missing
    if (!donorProfileId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newProfile, error: profileErr } = await (supabase as any)
        .from("donor_profiles")
        .upsert(
          [
            {
              user_id: userId,
              blood_group: "O+",
              date_of_birth: "1995-01-01",
              city: "Shambu",
            },
          ],
          { onConflict: "user_id" }
        )
        .select("id")
        .maybeSingle();

      if (profileErr) {
        return { success: false, error: "Failed to locate or create donor profile." };
      }
      donorProfileId = (newProfile as { id?: string } | null)?.id;
    }

    if (!donorProfileId) {
      return { success: false, error: "Donor profile ID unavailable." };
    }

    // Insert appointment record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newApt, error: insertError } = await (supabase as any)
      .from("appointments")
      .insert([
        {
          donor_id: donorProfileId,
          hospital_id: hospitalId,
          appointment_date: bookingDate.toISOString(),
          status: "scheduled",
          notes: notes || null,
        },
      ])
      .select("id, appointment_date, status, notes, created_at")
      .single();

    if (insertError) {
      console.error("Insert appointment error:", insertError);
      return { success: false, error: insertError.message || "Failed to book appointment." };
    }

    revalidatePath("/donor/appointments");

    return {
      success: true,
      appointment: {
        id: newApt.id,
        donorId: donorProfileId,
        hospitalId,
        hospitalName: "Requested Hospital Center",
        appointmentDate: newApt.appointment_date,
        formattedDate: bookingDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        formattedTime: bookingDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "scheduled",
        notes: notes || undefined,
        createdAt: newApt.created_at,
      },
    };
  } catch (err: any) {
    console.error("Book appointment error:", err);
    return { success: false, error: err?.message || "An error occurred while booking." };
  }
}

/**
 * Cancels an appointment for the authenticated donor
 */
export async function cancelAppointment(
  appointmentId: string
): Promise<{ success: boolean; error?: string }> {
  if (!appointmentId) {
    return { success: false, error: "Appointment ID is required." };
  }

  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("appointments")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", appointmentId);

    if (error) {
      return { success: false, error: error.message || "Failed to cancel appointment." };
    }

    revalidatePath("/donor/appointments");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "An unexpected error occurred." };
  }
}

/**
 * Reschedules an appointment to a new date and time
 */
export async function rescheduleAppointment(
  appointmentId: string,
  dateStr: string,
  timeStr: string
): Promise<{ success: boolean; error?: string }> {
  if (!appointmentId) {
    return { success: false, error: "Appointment ID is required." };
  }

  if (!dateStr || !timeStr) {
    return { success: false, error: "Please select a valid new date and time." };
  }

  const fullDateTimeStr = `${dateStr}T${timeStr}:00`;
  const newDate = new Date(fullDateTimeStr);

  if (isNaN(newDate.getTime())) {
    return { success: false, error: "Invalid date or time." };
  }

  if (newDate < new Date()) {
    return { success: false, error: "Rescheduled date must be in the future." };
  }

  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("appointments")
      .update({
        appointment_date: newDate.toISOString(),
        status: "scheduled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId);

    if (error) {
      return { success: false, error: error.message || "Failed to reschedule appointment." };
    }

    revalidatePath("/donor/appointments");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "An error occurred while rescheduling." };
  }
}
