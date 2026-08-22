"use server";

import { createClient } from "@/lib/supabase/server";

export type NotificationPreferences = {
  smsEmergencyAlerts: boolean;
  emailAppointmentReminders: boolean;
  emailCampaignInvites: boolean;
  inventoryShortageAlerts?: boolean;
  pushDonationReminders?: boolean;
};

const DEFAULT_PREFERENCES: NotificationPreferences = {
  smsEmergencyAlerts: true,
  emailAppointmentReminders: true,
  emailCampaignInvites: true,
  inventoryShortageAlerts: true,
  pushDonationReminders: false,
};

// ---------------------------------------------------------------------------
// Change password
// ---------------------------------------------------------------------------
export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!currentPassword) return { success: false, error: "Current password is required." };
    if (!newPassword) return { success: false, error: "New password is required." };
    if (newPassword.length < 8) return { success: false, error: "New password must be at least 8 characters." };
    if (newPassword !== confirmPassword) return { success: false, error: "New passwords do not match." };
    if (currentPassword === newPassword) return { success: false, error: "New password must be different from your current password." };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    // Verify the current password by re-authenticating
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return { success: false, error: "Could not verify your session. Please log in again." };

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInErr) {
      return { success: false, error: "Current password is incorrect." };
    }

    // Update to new password
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });

    if (updateErr) {
      return { success: false, error: updateErr.message || "Failed to update password. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in changePassword:", err);
    return { success: false, error: "An unexpected error occurred while updating your password." };
  }
}

// ---------------------------------------------------------------------------
// Get notification preferences (stored in auth user_metadata)
// ---------------------------------------------------------------------------
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return DEFAULT_PREFERENCES;

    const meta = user.user_metadata ?? {};
    return {
      smsEmergencyAlerts: typeof meta.notify_sms_emergency === "boolean" ? meta.notify_sms_emergency : DEFAULT_PREFERENCES.smsEmergencyAlerts,
      emailAppointmentReminders: typeof meta.notify_email_appointments === "boolean" ? meta.notify_email_appointments : DEFAULT_PREFERENCES.emailAppointmentReminders,
      emailCampaignInvites: typeof meta.notify_email_campaigns === "boolean" ? meta.notify_email_campaigns : DEFAULT_PREFERENCES.emailCampaignInvites,
      inventoryShortageAlerts: typeof meta.notify_inventory_shortages === "boolean" ? meta.notify_inventory_shortages : DEFAULT_PREFERENCES.inventoryShortageAlerts,
      pushDonationReminders: typeof meta.notify_push_donations === "boolean" ? meta.notify_push_donations : DEFAULT_PREFERENCES.pushDonationReminders,
    };
  } catch (err) {
    console.error("Error fetching notification preferences:", err);
    return DEFAULT_PREFERENCES;
  }
}

// ---------------------------------------------------------------------------
// Save notification preferences (to auth user_metadata)
// ---------------------------------------------------------------------------
export async function saveNotificationPreferences(
  prefs: NotificationPreferences
): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "You must be logged in to update preferences." };
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        notify_sms_emergency: prefs.smsEmergencyAlerts,
        notify_email_appointments: prefs.emailAppointmentReminders,
        notify_email_campaigns: prefs.emailCampaignInvites,
        notify_inventory_shortages: prefs.inventoryShortageAlerts ?? true,
        notify_push_donations: prefs.pushDonationReminders ?? false,
      },
    });

    if (error) return { success: false, error: error.message || "Failed to save preferences." };

    revalidatePath("/donor/settings");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (err) {
    console.error("Error saving notification preferences:", err);
    return { success: false, error: "An unexpected error occurred while saving preferences." };
  }
}

// ---------------------------------------------------------------------------
// Admin System Settings (Singleton Configuration)
// ---------------------------------------------------------------------------
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SystemSettings = {
  bloodBankName: string;
  emergencyHotline: string;
  primaryContactEmail: string;
  locationAddress: string;
  smsProvider: "Ethio Telecom Bulk SMS API" | "Twilio SMS Gateway";
  senderId: string;
};

export type PublicSystemSettings = {
  bloodBankName: string;
  emergencyHotline: string;
  primaryContactEmail: string;
  locationAddress: string;
};

const SINGLETON_SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  bloodBankName: "Shambu Blood Bank",
  emergencyHotline: "+251 57 665 0123",
  primaryContactEmail: "support@shambu-bloodbank.org",
  locationAddress: "Shambu Town, Horo Guduru Wollega, Oromia, Ethiopia",
  smsProvider: "Ethio Telecom Bulk SMS API",
  senderId: "SHAMBU-BLOOD",
};

/**
 * Admin action: Fetches current system settings from Supabase
 */
export async function getAdminSystemSettings(): Promise<SystemSettings> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const { data: row, error } = await supabase
      .from("system_settings")
      .select("blood_bank_name, emergency_hotline, primary_contact_email, address, sms_provider, sender_id")
      .eq("id", SINGLETON_SETTINGS_ID)
      .maybeSingle();

    if (error || !row) {
      // Fallback query if id is different or not specified
      const { data: firstRow } = await supabase
        .from("system_settings")
        .select("blood_bank_name, emergency_hotline, primary_contact_email, address, sms_provider, sender_id")
        .limit(1)
        .maybeSingle();

      if (firstRow) {
        return {
          bloodBankName: firstRow.blood_bank_name || DEFAULT_SYSTEM_SETTINGS.bloodBankName,
          emergencyHotline: firstRow.emergency_hotline || DEFAULT_SYSTEM_SETTINGS.emergencyHotline,
          primaryContactEmail: firstRow.primary_contact_email || DEFAULT_SYSTEM_SETTINGS.primaryContactEmail,
          locationAddress: firstRow.address || DEFAULT_SYSTEM_SETTINGS.locationAddress,
          smsProvider: (firstRow.sms_provider as any) || DEFAULT_SYSTEM_SETTINGS.smsProvider,
          senderId: firstRow.sender_id || DEFAULT_SYSTEM_SETTINGS.senderId,
        };
      }

      return DEFAULT_SYSTEM_SETTINGS;
    }

    return {
      bloodBankName: row.blood_bank_name || DEFAULT_SYSTEM_SETTINGS.bloodBankName,
      emergencyHotline: row.emergency_hotline || DEFAULT_SYSTEM_SETTINGS.emergencyHotline,
      primaryContactEmail: row.primary_contact_email || DEFAULT_SYSTEM_SETTINGS.primaryContactEmail,
      locationAddress: row.address || DEFAULT_SYSTEM_SETTINGS.locationAddress,
      smsProvider: (row.sms_provider as any) || DEFAULT_SYSTEM_SETTINGS.smsProvider,
      senderId: row.sender_id || DEFAULT_SYSTEM_SETTINGS.senderId,
    };
  } catch (err) {
    console.error("Error fetching system settings:", err);
    return DEFAULT_SYSTEM_SETTINGS;
  }
}

/**
 * Safe public query: Returns ONLY non-sensitive organization details
 */
export async function getPublicSystemSettings(): Promise<PublicSystemSettings> {
  const full = await getAdminSystemSettings();
  return {
    bloodBankName: full.bloodBankName,
    emergencyHotline: full.emergencyHotline,
    primaryContactEmail: full.primaryContactEmail,
    locationAddress: full.locationAddress,
  };
}

/**
 * Admin action: Saves/Updates system settings in Supabase atomically
 */
export async function saveAdminSystemSettings(
  input: SystemSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const bloodBankName = (input.bloodBankName || "").trim();
    const emergencyHotline = (input.emergencyHotline || "").trim();
    const primaryContactEmail = (input.primaryContactEmail || "").trim();
    const locationAddress = (input.locationAddress || "").trim();
    const smsProvider = input.smsProvider || "Ethio Telecom Bulk SMS API";
    const senderId = (input.senderId || "").trim();

    if (!bloodBankName) {
      return { success: false, error: "Blood Bank Name is required." };
    }
    if (!emergencyHotline) {
      return { success: false, error: "Emergency Hotline Phone is required." };
    }
    if (!primaryContactEmail || !primaryContactEmail.includes("@")) {
      return { success: false, error: "A valid Primary Contact Email is required." };
    }
    if (!locationAddress) {
      return { success: false, error: "Location / Address is required." };
    }
    if (!senderId) {
      return { success: false, error: "Sender ID is required." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const payload = {
      id: SINGLETON_SETTINGS_ID,
      blood_bank_name: bloodBankName,
      emergency_hotline: emergencyHotline,
      primary_contact_email: primaryContactEmail,
      address: locationAddress,
      sms_provider: smsProvider,
      sender_id: senderId,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("system_settings")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Error saving system settings to database:", error);
      return { success: false, error: "Failed to save system settings to Supabase." };
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin/notifications");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in saveAdminSystemSettings:", err);
    return { success: false, error: "An unexpected error occurred while saving settings." };
  }
}
