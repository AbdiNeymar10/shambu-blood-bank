"use server";

import { createClient } from "@/lib/supabase/server";

export type NotificationPreferences = {
  smsEmergencyAlerts: boolean;
  emailAppointmentReminders: boolean;
  emailCampaignInvites: boolean;
  pushDonationReminders: boolean;
};

const DEFAULT_PREFERENCES: NotificationPreferences = {
  smsEmergencyAlerts: true,
  emailAppointmentReminders: true,
  emailCampaignInvites: true,
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
}

// ---------------------------------------------------------------------------
// Get notification preferences (stored in auth user_metadata)
// ---------------------------------------------------------------------------
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return DEFAULT_PREFERENCES;

  const meta = user.user_metadata ?? {};
  return {
    smsEmergencyAlerts: meta.notify_sms_emergency ?? DEFAULT_PREFERENCES.smsEmergencyAlerts,
    emailAppointmentReminders: meta.notify_email_appointments ?? DEFAULT_PREFERENCES.emailAppointmentReminders,
    emailCampaignInvites: meta.notify_email_campaigns ?? DEFAULT_PREFERENCES.emailCampaignInvites,
    pushDonationReminders: meta.notify_push_donations ?? DEFAULT_PREFERENCES.pushDonationReminders,
  };
}

// ---------------------------------------------------------------------------
// Save notification preferences (to auth user_metadata)
// ---------------------------------------------------------------------------
export async function saveNotificationPreferences(
  prefs: NotificationPreferences
): Promise<{ success: boolean; error?: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;

  const { error } = await supabase.auth.updateUser({
    data: {
      notify_sms_emergency: prefs.smsEmergencyAlerts,
      notify_email_appointments: prefs.emailAppointmentReminders,
      notify_email_campaigns: prefs.emailCampaignInvites,
      notify_push_donations: prefs.pushDonationReminders,
    },
  });

  if (error) return { success: false, error: error.message || "Failed to save preferences." };
  return { success: true };
}
