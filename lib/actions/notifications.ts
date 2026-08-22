"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export type NotificationType =
  | "emergency_alert"
  | "donation_reminder"
  | "request_update"
  | "appointment_confirmation"
  | "campaign_invite"
  | "system";

export type NotificationRecord = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  /** Human-friendly relative time, e.g. "2 hours ago" */
  timeAgo: string;
};

export type TargetAudienceOption =
  | "All Donors (Universal)"
  | "A+ Positive Donors Only"
  | "A- Negative Donors Only"
  | "B+ Positive Donors Only"
  | "B- Negative Donors Only"
  | "AB+ Positive Donors Only"
  | "AB- Negative Donors Only"
  | "O+ Positive Donors Only"
  | "O- Negative Donors Only"
  | "Shambu City Donors Only";

export type AdminNotificationLog = {
  id: string;
  title: string;
  type: string;
  audience: string;
  date: string;
  status: "Sent" | "Queued";
  delivered: number;
};

// ---------------------------------------------------------------------------
// Helper: relative time
// ---------------------------------------------------------------------------
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Helper: get public.users(id) for the logged-in auth user
// ---------------------------------------------------------------------------
async function getCurrentUserId(): Promise<string | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("users").select("id").eq("auth_id", user.id).maybeSingle();
  return (data as { id?: string } | null)?.id ?? null;
}

// ---------------------------------------------------------------------------
// Fetch notifications for the logged-in donor
// ---------------------------------------------------------------------------
export async function getDonorNotifications(): Promise<{
  notifications: NotificationRecord[];
  unreadCount: number;
}> {
  const userId = await getCurrentUserId();
  if (!userId) return { notifications: [], unreadCount: 0 };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;

  const { data, error } = await supabase
    .from("notifications")
    .select("id, user_id, type, title, message, link, is_read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return { notifications: [], unreadCount: 0 };

  const notifications: NotificationRecord[] = (
    data as {
      id: string; user_id: string; type: NotificationType;
      title: string; message: string; link?: string;
      is_read: boolean; created_at: string;
    }[]
  ).map((n) => ({
    id: n.id,
    userId: n.user_id,
    type: n.type,
    title: n.title,
    message: n.message,
    link: n.link,
    isRead: n.is_read,
    createdAt: n.created_at,
    timeAgo: timeAgo(n.created_at),
  }));

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return { notifications, unreadCount };
}

// ---------------------------------------------------------------------------
// Mark a single notification as read
// ---------------------------------------------------------------------------
export async function markNotificationRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  if (!notificationId) return { success: false, error: "Notification ID required." };

  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: "Not authenticated." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId); // RLS safety

  if (error) return { success: false, error: error.message };

  revalidatePath("/donor/notifications");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Mark ALL notifications as read
// ---------------------------------------------------------------------------
export async function markAllNotificationsRead(): Promise<{ success: boolean; error?: string }> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: "Not authenticated." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) return { success: false, error: error.message };

  revalidatePath("/donor/notifications");
  return { success: true };
}

/**
 * Admin server action: Dispatches a broadcast alert to targeted donors in Supabase.
 */
export async function dispatchBroadcastAlert(input: {
  title: string;
  audience: TargetAudienceOption;
  message: string;
}): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    const title = (input.title || "").trim();
    const message = (input.message || "").trim();
    const audience = input.audience || "All Donors (Universal)";

    if (!title || !message) {
      return { success: false, error: "Notification title and message content are required." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    // 1. Resolve Target Audience Donors
    let recipientUserIds: string[] = [];

    if (audience === "All Donors (Universal)") {
      // Query users table for all donors + donor profiles to ensure zero exclusion
      const [usersRes, profilesRes] = await Promise.all([
        supabase.from("users").select("id").eq("role", "donor"),
        supabase.from("donor_profiles").select("user_id"),
      ]);

      const userIdsFromUsers = (usersRes.data || []).map((u: any) => u.id);
      const userIdsFromProfiles = (profilesRes.data || []).map((p: any) => p.user_id);

      recipientUserIds = Array.from(new Set([...userIdsFromUsers, ...userIdsFromProfiles].filter(Boolean)));

      // Fallback: If no donor role filter is matched, fetch all registered users
      if (recipientUserIds.length === 0) {
        const { data: allUsers } = await supabase.from("users").select("id");
        recipientUserIds = (allUsers || []).map((u: any) => u.id).filter(Boolean);
      }
    } else if (audience === "Shambu City Donors Only") {
      const { data: donorProfiles } = await supabase
        .from("donor_profiles")
        .select("user_id")
        .ilike("city", "%Shambu%");
      recipientUserIds = Array.from(new Set((donorProfiles || []).map((d: any) => d.user_id).filter(Boolean)));
    } else {
      // Extract blood group from audience string
      let bgMatch = "";
      if (audience.startsWith("A+")) bgMatch = "A+";
      else if (audience.startsWith("A-")) bgMatch = "A-";
      else if (audience.startsWith("B+")) bgMatch = "B+";
      else if (audience.startsWith("B-")) bgMatch = "B-";
      else if (audience.startsWith("AB+")) bgMatch = "AB+";
      else if (audience.startsWith("AB-")) bgMatch = "AB-";
      else if (audience.startsWith("O+")) bgMatch = "O+";
      else if (audience.startsWith("O-")) bgMatch = "O-";

      if (bgMatch) {
        const { data: donorProfiles } = await supabase
          .from("donor_profiles")
          .select("user_id")
          .eq("blood_group", bgMatch);
        recipientUserIds = Array.from(new Set((donorProfiles || []).map((d: any) => d.user_id).filter(Boolean)));
      }
    }

    if (recipientUserIds.length === 0) {
      return { success: false, error: `No registered donors found matching "${audience}".` };
    }

    // 2. Batch Insert Notifications
    const nowIso = new Date().toISOString();

    const notifRows = recipientUserIds.map((uid) => ({
      user_id: uid,
      title,
      message,
      type: "emergency_alert",
      is_read: false,
      created_at: nowIso,
    }));

    const { error: insertErr } = await supabase.from("notifications").insert(notifRows);

    if (insertErr) {
      console.error("Error inserting broadcast notifications:", insertErr);
      return { success: false, error: "Failed to store broadcast notifications in database." };
    }

    revalidatePath("/admin/notifications");
    revalidatePath("/donor/notifications");

    return { success: true, count: recipientUserIds.length };
  } catch (err) {
    console.error("Unexpected error in dispatchBroadcastAlert:", err);
    return { success: false, error: "An unexpected error occurred while dispatching broadcast." };
  }
}

/**
 * Admin server action: Fetches history of dispatched broadcast notification logs.
 */
export async function getAdminNotificationLogs(): Promise<AdminNotificationLog[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const { data: rows, error } = await supabase
      .from("notifications")
      .select("id, title, type, created_at, user_id")
      .order("created_at", { ascending: false });

    if (error || !rows || rows.length === 0) return [];

    // Group rows by Title + Created Minute to represent distinct Broadcast dispatches
    const groupedMap = new Map<string, { title: string; type: string; date: string; count: number; rawType: string }>();

    rows.forEach((r: any) => {
      const dateKey = r.created_at ? r.created_at.substring(0, 16) : "now";
      const groupKey = `${r.title}___${dateKey}`;

      if (groupedMap.has(groupKey)) {
        const existing = groupedMap.get(groupKey)!;
        existing.count += 1;
      } else {
        const dObj = r.created_at ? new Date(r.created_at) : new Date();
        const dateStr = dObj.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        groupedMap.set(groupKey, {
          title: r.title || "Broadcast Notification",
          type: r.type || "emergency_alert",
          date: dateStr,
          count: 1,
          rawType: r.type || "emergency_alert",
        });
      }
    });

    const result: AdminNotificationLog[] = [];
    let idx = 1;

    groupedMap.forEach((val) => {
      let typeLabel = "Emergency Alert";
      if (val.rawType === "campaign_invite" || val.title.toLowerCase().includes("drive") || val.title.toLowerCase().includes("campaign")) {
        typeLabel = "Campaign Invite";
      } else if (val.rawType === "appointment_confirmation" || val.title.toLowerCase().includes("appointment")) {
        typeLabel = "Appointment";
      } else if (val.rawType === "system" || val.title.toLowerCase().includes("digest") || val.title.toLowerCase().includes("weekly")) {
        typeLabel = "System Alert";
      }

      let audienceLabel = "All Registered Donors";
      const tLower = val.title.toLowerCase();
      if (tLower.includes("o-")) audienceLabel = "O- Negative Donors";
      else if (tLower.includes("o+")) audienceLabel = "O+ Positive Donors";
      else if (tLower.includes("a-")) audienceLabel = "A- Negative Donors";
      else if (tLower.includes("a+")) audienceLabel = "A+ Positive Donors";
      else if (tLower.includes("b-")) audienceLabel = "B- Negative Donors";
      else if (tLower.includes("b+")) audienceLabel = "B+ Positive Donors";
      else if (tLower.includes("ab-")) audienceLabel = "AB- Negative Donors";
      else if (tLower.includes("ab+")) audienceLabel = "AB+ Positive Donors";
      else if (tLower.includes("shambu")) audienceLabel = "Shambu City Donors";

      result.push({
        id: `broadcast-log-${idx++}`,
        title: val.title,
        type: typeLabel,
        audience: audienceLabel,
        date: val.date,
        status: "Sent",
        delivered: val.count,
      });
    });

    return result;
  } catch (err) {
    console.error("Error fetching admin notification logs:", err);
    return [];
  }
}
