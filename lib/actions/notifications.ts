"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
