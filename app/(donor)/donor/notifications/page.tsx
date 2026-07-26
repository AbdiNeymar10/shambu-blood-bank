"use client";

import { useEffect, useState, useTransition, useCallback, useRef } from "react";
import {
  Bell,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Megaphone,
  Info,
  Loader2,
  BellOff,
  MailCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  getDonorNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationRecord,
  type NotificationType,
} from "@/lib/actions/notifications";

// ---------------------------------------------------------------------------
// Type icon + color config
// ---------------------------------------------------------------------------
type IconComponent = React.FC<{ className?: string }>;

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: IconComponent; badge: string; iconColor: string }
> = {
  emergency_alert: {
    label: "Emergency Appeal",
    icon: ShieldAlert,
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-none font-bold text-[10px]",
    iconColor: "text-rose-500",
  },
  appointment_confirmation: {
    label: "Appointment",
    icon: Calendar,
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none font-bold text-[10px]",
    iconColor: "text-blue-500",
  },
  campaign_invite: {
    label: "Campaign",
    icon: Megaphone,
    badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-none font-bold text-[10px]",
    iconColor: "text-violet-500",
  },
  donation_reminder: {
    label: "Donation Reminder",
    icon: Bell,
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold text-[10px]",
    iconColor: "text-amber-500",
  },
  request_update: {
    label: "Request Update",
    icon: CheckCircle2,
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold text-[10px]",
    iconColor: "text-emerald-500",
  },
  system: {
    label: "System",
    icon: Info,
    badge: "bg-muted text-muted-foreground border-none font-bold text-[10px]",
    iconColor: "text-muted-foreground",
  },
};

function getConfig(type: NotificationType) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG.system;
}

// ---------------------------------------------------------------------------
// Single notification row
// ---------------------------------------------------------------------------
function NotificationRow({
  item,
  onRead,
  isMarking,
}: {
  item: NotificationRecord;
  onRead: (id: string) => void;
  isMarking: boolean;
}) {
  const cfg = getConfig(item.type);
  const Icon: IconComponent = cfg.icon;

  return (
    <div
      className={`p-5 flex items-start gap-4 hover:bg-secondary/20 transition-colors cursor-pointer ${!item.isRead ? "bg-primary/5" : ""}`}
      onClick={() => !item.isRead && !isMarking && onRead(item.id)}
    >
      {/* Icon */}
      <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${!item.isRead ? "bg-primary/10" : "bg-muted"}`}>
        <Icon className={`w-4 h-4 ${!item.isRead ? cfg.iconColor : "text-muted-foreground"}`} />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={cfg.badge}>{cfg.label}</Badge>
          <span className="text-xs text-muted-foreground">{item.timeAgo}</span>
        </div>
        <h4 className={`text-sm font-bold ${item.isRead ? "text-muted-foreground" : "text-foreground"}`}>
          {item.title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{item.message}</p>
        {item.link && (
          <a
            href={item.link}
            className="text-xs text-primary underline-offset-2 hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            View details →
          </a>
        )}
      </div>

      {/* Unread dot */}
      {!item.isRead && (
        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2" />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DonorNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const channelRef = useRef<ReturnType<typeof createClient>["channel"] extends infer C ? C : never | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const load = useCallback(async () => {
    const { notifications: data } = await getDonorNotifications();
    setNotifications(data);
    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    load();
  }, [load]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          // Re-fetch on any change (insert, update, delete)
          load();
        }
      )
      .subscribe();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (channelRef as any).current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const handleMarkRead = (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    startTransition(async () => {
      await markNotificationRead(id);
    });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    startTransition(async () => {
      await markAllNotificationsRead();
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            Notifications &amp; Appeals
          </h1>
          <p className="text-muted-foreground font-medium">
            Stay updated on emergency blood appeals, appointments, and campaign invites.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-2 font-semibold"
            disabled={isPending}
            onClick={handleMarkAllRead}
          >
            <MailCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Unread count chip */}
      {unreadCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary font-semibold text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {unreadCount} unread
          </span>
          <span>Click a notification to mark it as read</span>
        </div>
      )}

      {/* Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-border/60">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Center
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          )}

          {/* Empty */}
          {!loading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <BellOff className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-base font-semibold text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground">
                You'll receive alerts here for emergencies, appointments, and campaigns.
              </p>
            </div>
          )}

          {/* List */}
          {!loading && notifications.length > 0 && (
            <div className="divide-y divide-border/60">
              {notifications.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  onRead={handleMarkRead}
                  isMarking={isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
