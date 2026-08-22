"use server";

import { createClient } from "@/lib/supabase/server";
import type { BloodGroup } from "@/types/database.types";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
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
  status: string;
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

/**
 * Fetches all metrics and upcoming appointments for the Admin Appointments page from Supabase.
 */
export async function getAdminAppointmentsData(): Promise<AdminAppointmentsData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      todaysAppointmentsRes,
      completedTodayRes,
      pendingConfirmationRes,
      upcomingScheduleRes,
    ] = await Promise.all([
      // 1. Today's appointments count
      supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .gte("appointment_date", todayStart.toISOString())
        .lte("appointment_date", todayEnd.toISOString()),

      // 2. Completed today count
      supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .gte("appointment_date", todayStart.toISOString())
        .lte("appointment_date", todayEnd.toISOString())
        .eq("status", "completed"),

      // 3. Pending confirmation count (scheduled)
      supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("status", "scheduled"),

      // 4. Upcoming appointment schedule (top 5)
      supabase
        .from("appointments")
        .select("id, appointment_date, status, notes, donor_profiles(id, blood_group, users(full_name, phone)), hospitals(name)")
        .order("appointment_date", { ascending: true })
        .limit(5),
    ]);

    const todaysAppointments = todaysAppointmentsRes.count ?? 0;
    const completedToday = completedTodayRes.count ?? 0;
    const pendingConfirmation = pendingConfirmationRes.count ?? 0;

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

      const rawStatus = (row.status || "scheduled").toString();
      const statusFormatted =
        rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

      return {
        id: row.id,
        donorName: user?.full_name || "Anonymous Donor",
        bloodGroup: donorProfile?.blood_group || "O+",
        date: dateFormatted,
        time: timeFormatted,
        center: hospital?.name || "Shambu Center",
        status: statusFormatted,
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
 * Updates an appointment status to 'completed' (Process Check-in).
 */
export async function processAppointmentCheckIn(appointmentId: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from("appointments")
      .update({ status: "completed" })
      .eq("id", appointmentId);

    if (error) {
      console.error("Check-in error:", error);
      return { success: false, error: "Failed to process check-in." };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in processAppointmentCheckIn:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
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
    const supabase = (await createClient()) as any;

    const dateTimeStr = input.time
      ? `${input.date}T${input.time}:00`
      : `${input.date}T09:00:00`;

    const apptDateObj = new Date(dateTimeStr);
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
    const supabase = (await createClient()) as any;

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
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { appointments: [], usingMock: false };

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
      .order("appointment_date", { ascending: false });

    if (error || !data) return { appointments: [], usingMock: false };

    const appointments: AppointmentRecord[] = data.map((item: any) => {
      const dObj = new Date(item.appointment_date);
      const hospitalObj = Array.isArray(item.hospitals)
        ? item.hospitals[0]
        : item.hospitals;

      return {
        id: item.id,
        donor_id: item.donor_id,
        hospital_id: item.hospital_id,
        appointment_date: item.appointment_date,
        appointmentDate: item.appointment_date,
        status: item.status as AppointmentStatus,
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
    const supabase = (await createClient()) as any;
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
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data: userRow } = await supabase
      .from("users").select("id").eq("auth_id", user.id).maybeSingle();
    if (!userRow?.id) return { success: false, error: "User profile not found" };

    const { data: profile } = await supabase
      .from("donor_profiles").select("id").eq("user_id", userRow.id).maybeSingle();
    if (!profile?.id) return { success: false, error: "Donor profile not found" };

    const dateTimeStr = time ? `${date}T${time}:00` : `${date}T09:00:00`;
    const apptDateIso = new Date(dateTimeStr).toISOString();

    const { error } = await supabase.from("appointments").insert({
      donor_id: profile.id,
      hospital_id: hospital_id,
      appointment_date: apptDateIso,
      notes: notes || null,
      status: "scheduled",
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function cancelAppointment(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function rescheduleAppointment(
  id: string,
  newDate: string,
  newTime?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;
    const dateTimeStr = newTime ? `${newDate}T${newTime}:00` : `${newDate}T09:00:00`;
    const apptDateIso = new Date(dateTimeStr).toISOString();

    const { error } = await supabase
      .from("appointments")
      .update({ appointment_date: apptDateIso, status: "scheduled" })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
