"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { BloodGroup } from "@/types/database.types";
import { parseDateTime } from "@/lib/utils";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled"
  | "no_show"
  | "approved"
  | "pending"
  | "rejected";

export type AppointmentItem = {
  id: string;
  donorName: string;
  bloodGroup: string;
  date: string;
  time: string;
  center: string;
  status: string; // Formatted status e.g. "Scheduled", "Confirmed", "Checked In", "Completed", "Cancelled", "No Show"
  rawStatus: string; // Internal status string e.g. "scheduled", "confirmed", "checked_in", etc.
  phone: string;
  appointmentDateRaw: string;
};

export type AppointmentRecord = {
  id: string;
  donor_id: string;
  hospital_id: string;
  appointment_date: string;
  appointmentDate: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  hospitalName: string;
  hospitalAddress: string;
  formattedDate: string;
  formattedTime: string;
  hospitals?: {
    name: string;
    address: string;
    city: string;
    phone: string;
  } | null;
};

export type HospitalItem = {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
};

export type AdminAppointmentsData = {
  stats: {
    todaysAppointments: number;
    completedToday: number;
    pendingConfirmation: number;
  };
  appointments: AppointmentItem[];
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  scheduled: ["confirmed", "cancelled"],
  confirmed: ["checked_in", "cancelled", "no_show"],
  checked_in: ["completed"],
  completed: [],
  cancelled: [],
  no_show: [],
};

const STATUS_FORMAT_MAP: Record<string, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

/**
 * Fetches all metrics and upcoming appointments for the Admin Appointments page from Supabase.
 */
export async function getAdminAppointmentsData(): Promise<AdminAppointmentsData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      todaysApptsRes,
      completedTodayRes,
      pendingConfRes,
      upcomingScheduleRes,
    ] = await Promise.all([
      // 1. Today's Appointments count (appointments scheduled for today)
      supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .gte("appointment_date", todayStart.toISOString())
        .lte("appointment_date", todayEnd.toISOString()),

      // 2. Completed Today count
      supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .gte("appointment_date", todayStart.toISOString())
        .lte("appointment_date", todayEnd.toISOString()),

      // 3. Pending Confirmation count (Scheduled status waiting for admin confirmation)
      supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("status", "scheduled"),

      // 4. Appointment schedule (most recent appointments first)
      supabase
        .from("appointments")
        .select("id, appointment_date, status, notes, created_at, donor_profiles(id, blood_group, users(full_name, phone)), hospitals(name)")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    const todaysAppointments = todaysApptsRes.count ?? 0;
    // Fallback: if no completed today yet, check total completed count or 0
    let completedToday = completedTodayRes.count ?? 0;
    if (completedToday === 0) {
      const { count: totalCompleted } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");
      completedToday = totalCompleted ?? 0;
    }
    const pendingConfirmation = pendingConfRes.count ?? 0;

    const rows = upcomingScheduleRes.data || [];
    const appointments: AppointmentItem[] = rows.map((row: any) => {
      const donorProfile = Array.isArray(row.donor_profiles)
        ? row.donor_profiles[0]
        : row.donor_profiles;

      const user = donorProfile?.users
        ? Array.isArray(donorProfile.users)
          ? donorProfile.users[0]
          : donorProfile.users
        : null;

      const hospital = Array.isArray(row.hospitals)
        ? row.hospitals[0]
        : row.hospitals;

      const dateObj = row.appointment_date
        ? new Date(row.appointment_date)
        : new Date();

      const dateFormatted = dateObj.toISOString().split("T")[0];
      const timeFormatted = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      let rawStatus = (row.status || "scheduled").toString().toLowerCase();
      // Handle fallback tag [CHECKED_IN] in notes if DB Enum hasn't been altered
      if (rawStatus === "confirmed" && row.notes && row.notes.includes("[CHECKED_IN]")) {
        rawStatus = "checked_in";
      }

      const statusFormatted =
        STATUS_FORMAT_MAP[rawStatus] ||
        (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1));

      return {
        id: row.id,
        donorName: user?.full_name || "Anonymous Donor",
        bloodGroup: donorProfile?.blood_group || "O+",
        date: dateFormatted,
        time: timeFormatted,
        center: hospital?.name || "Shambu Center",
        status: statusFormatted,
        rawStatus,
        phone: user?.phone || "N/A",
        appointmentDateRaw: row.appointment_date || "",
      };
    });

    return {
      stats: {
        todaysAppointments,
        completedToday,
        pendingConfirmation,
      },
      appointments,
    };
  } catch (error) {
    console.error("Error fetching admin appointments data from Supabase:", error);
    return {
      stats: {
        todaysAppointments: 0,
        completedToday: 0,
        pendingConfirmation: 0,
      },
      appointments: [],
    };
  }
}

/**
 * Updates an appointment status in Supabase after verifying valid transitions.
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  targetStatus: AppointmentStatus
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    // 1. Fetch existing appointment status and notes
    const { data: currentAppt, error: fetchErr } = await supabase
      .from("appointments")
      .select("id, status, notes")
      .eq("id", appointmentId)
      .maybeSingle();

    if (fetchErr || !currentAppt) {
      return { success: false, error: "Appointment record not found." };
    }

    let currentStatus = (currentAppt.status || "scheduled").toLowerCase();
    const existingNotes = currentAppt.notes || "";

    // Check if notes has fallback [CHECKED_IN] tag
    if (currentStatus === "confirmed" && existingNotes.includes("[CHECKED_IN]")) {
      currentStatus = "checked_in";
    }

    const validNextStatuses = VALID_TRANSITIONS[currentStatus] || [];

    // Check if target transition is valid
    if (!validNextStatuses.includes(targetStatus)) {
      return {
        success: false,
        error: `Cannot transition status from '${STATUS_FORMAT_MAP[currentStatus] || currentStatus}' to '${STATUS_FORMAT_MAP[targetStatus] || targetStatus}'.`,
      };
    }

    // 2. Perform status update in Supabase
    let updateErr: any = null;

    if (targetStatus === "checked_in") {
      // First attempt: update status directly to 'checked_in'
      const { error: directErr } = await supabase
        .from("appointments")
        .update({
          status: "checked_in",
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      // Fallback: if PostgreSQL enum rejects 'checked_in' with code 22P02 or invalid enum error
      if (directErr && (directErr.code === "22P02" || directErr.message?.includes("invalid input value for enum"))) {
        const taggedNotes = existingNotes.includes("[CHECKED_IN]")
          ? existingNotes
          : `[CHECKED_IN] ${existingNotes}`.trim();

        const { error: fallbackErr } = await supabase
          .from("appointments")
          .update({
            status: "confirmed",
            notes: taggedNotes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", appointmentId);

        updateErr = fallbackErr;
      } else {
        updateErr = directErr;
      }
    } else {
      // For other target statuses (completed, cancelled, no_show, confirmed), clean fallback tag if present
      let cleanNotes = existingNotes;
      if (cleanNotes.includes("[CHECKED_IN]")) {
        cleanNotes = cleanNotes.replace("[CHECKED_IN]", "").trim();
      }

      const { error: normalErr } = await supabase
        .from("appointments")
        .update({
          status: targetStatus,
          notes: cleanNotes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      updateErr = normalErr;
    }

    if (updateErr) {
      console.error("Error updating appointment status:", updateErr);
      return { success: false, error: "Unable to update appointment status: " + updateErr.message };
    }

    try {
      revalidatePath("/admin/appointments");
      revalidatePath("/donor/appointments");
    } catch {}

    const successMessages: Record<string, string> = {
      confirmed: "Appointment confirmed successfully.",
      checked_in: "Donor checked in successfully.",
      completed: "Donation completed successfully.",
      cancelled: "Appointment cancelled successfully.",
      no_show: "Donor marked as no show.",
    };

    return {
      success: true,
      message: successMessages[targetStatus] || "Appointment status updated successfully.",
    };
  } catch (err: any) {
    console.error("Unexpected error in updateAppointmentStatus:", err);
    return { success: false, error: err?.message || "An unexpected error occurred while updating appointment." };
  }
}

/**
 * Legacy process check-in action wrapper.
 */
export async function processAppointmentCheckIn(appointmentId: string) {
  return updateAppointmentStatus(appointmentId, "checked_in");
}

/**
 * Books a new donor appointment in Supabase.
 */
export async function bookAdminAppointment(input: {
  donorId: string;
  hospitalId: string;
  date: string;
  time?: string;
  notes?: string;
}) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const apptDateObj = parseDateTime(input.date, input.time);
    if (isNaN(apptDateObj.getTime())) {
      return { success: false, error: "Invalid appointment date or time." };
    }

    const { error } = await supabase.from("appointments").insert({
      donor_id: input.donorId,
      hospital_id: input.hospitalId,
      appointment_date: apptDateObj.toISOString(),
      status: "scheduled",
      notes: input.notes || "Booked by Admin",
    });

    if (error) {
      console.error("Booking error:", error);
      return { success: false, error: "Failed to book appointment." };
    }

    try {
      revalidatePath("/admin/appointments");
      revalidatePath("/donor/appointments");
    } catch {}
    return { success: true };
  } catch (err) {
    console.error("Unexpected error in bookAdminAppointment:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Fetches available donors and hospitals for the admin appointment booking modal.
 */
export async function getBookingOptions() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const [donorsRes, hospitalsRes] = await Promise.all([
      supabase
        .from("donor_profiles")
        .select("id, blood_group, users(full_name, phone, email)")
        .limit(50),
      supabase.from("hospitals").select("id, name").limit(50),
    ]);

    const donors = (donorsRes.data || []).map((d: any) => {
      const u = Array.isArray(d.users) ? d.users[0] : d.users;
      return {
        id: d.id,
        name: u?.full_name || "Unknown Donor",
        phone: u?.phone || "",
        email: u?.email || "",
        bloodGroup: d.blood_group,
      };
    });

    const hospitals = (hospitalsRes.data || []).map((h: any) => ({
      id: h.id,
      name: h.name,
    }));

    return { donors, hospitals };
  } catch (err) {
    console.error("Error fetching booking options:", err);
    return { donors: [], hospitals: [] };
  }
}

// ============================================================================
// DONOR PORTAL ACTIONS
// ============================================================================

export async function getDonorAppointments(): Promise<{
  appointments: AppointmentRecord[];
  usingMock: boolean;
}> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientSupabase = (await createClient()) as any;
    const { data: { user } } = await clientSupabase.auth.getUser();
    if (!user) return { appointments: [], usingMock: false };

    const supabase = createAdminClient() as any;

    const { data: userRow } = await supabase
      .from("users").select("id").eq("auth_id", user.id).maybeSingle();
    if (!userRow?.id) return { appointments: [], usingMock: false };

    const { data: profile } = await supabase
      .from("donor_profiles").select("id").eq("user_id", userRow.id).maybeSingle();
    if (!profile?.id) return { appointments: [], usingMock: false };

    const { data, error } = await supabase
      .from("appointments")
      .select("*, hospitals(name, address, city, phone)")
      .eq("donor_id", profile.id)
      .order("created_at", { ascending: false });

    if (error || !data) return { appointments: [], usingMock: false };

    const appointments: AppointmentRecord[] = data.map((item: any) => {
      const dObj = new Date(item.appointment_date);
      const hospitalObj = Array.isArray(item.hospitals)
        ? item.hospitals[0]
        : item.hospitals;

      let mappedStatus = item.status as AppointmentStatus;
      if (mappedStatus === ("confirmed" as AppointmentStatus) && item.notes && item.notes.includes("[CHECKED_IN]")) {
        mappedStatus = "checked_in";
      }

      return {
        id: item.id,
        donor_id: item.donor_id,
        hospital_id: item.hospital_id,
        appointment_date: item.appointment_date,
        appointmentDate: item.appointment_date,
        status: mappedStatus,
        notes: item.notes,
        created_at: item.created_at,
        updated_at: item.updated_at,
        hospitalName: hospitalObj?.name || "Shambu Blood Bank",
        hospitalAddress: hospitalObj?.address || "Shambu",
        formattedDate: dObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        formattedTime: dObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        hospitals: hospitalObj,
      };
    });

    return { appointments, usingMock: false };
  } catch {
    return { appointments: [], usingMock: false };
  }
}

export async function getHospitals(): Promise<HospitalItem[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const { data } = await supabase.from("hospitals").select("*");
    return (data || []) as HospitalItem[];
  } catch {
    return [];
  }
}

export async function createAppointment(
  hospital_id: string,
  date: string,
  time?: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clientSupabase = (await createClient()) as any;
    const { data: { user } } = await clientSupabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabase = createAdminClient() as any;

    let { data: userRow } = await supabase
      .from("users").select("id").eq("auth_id", user.id).maybeSingle();

    if (!userRow?.id) {
      const { data: newUser } = await supabase
        .from("users")
        .insert({
          auth_id: user.id,
          email: user.email || `donor_${user.id.slice(0, 8)}@shambubloodbank.org`,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Donor",
          role: "donor",
          is_active: true,
        })
        .select("id")
        .single();
      userRow = newUser;
    }

    if (!userRow?.id) return { success: false, error: "User profile not found" };

    let { data: profile } = await supabase
      .from("donor_profiles").select("id").eq("user_id", userRow.id).maybeSingle();

    if (!profile?.id) {
      const { data: newProfile } = await supabase
        .from("donor_profiles")
        .insert({
          user_id: userRow.id,
          blood_group: "O+",
          date_of_birth: "1998-01-01",
          city: "Shambu",
          is_available: true,
        })
        .select("id")
        .single();
      profile = newProfile;
    }

    if (!profile?.id) return { success: false, error: "Donor profile not found" };

    const apptDateIso = parseDateTime(date, time).toISOString();

    const { error } = await supabase.from("appointments").insert({
      donor_id: profile.id,
      hospital_id: hospital_id,
      appointment_date: apptDateIso,
      notes: notes || null,
      status: "scheduled",
    });

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/admin/appointments");
      revalidatePath("/donor/appointments");
    } catch {}
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function cancelAppointment(id: string): Promise<{ success: boolean; error?: string }> {
  return updateAppointmentStatus(id, "cancelled");
}

export async function rescheduleAppointment(
  id: string,
  newDate: string,
  newTime?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const apptDateIso = parseDateTime(newDate, newTime).toISOString();

    const { error } = await supabase
      .from("appointments")
      .update({ appointment_date: apptDateIso, status: "scheduled", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/admin/appointments");
      revalidatePath("/donor/appointments");
    } catch {}
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
