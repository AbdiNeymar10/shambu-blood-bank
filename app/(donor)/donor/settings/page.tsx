"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Lock,
  Bell,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  Mail,
  Megaphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  changePassword,
  getNotificationPreferences,
  saveNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/actions/settings";

// ---------------------------------------------------------------------------
// Toast helper
// ---------------------------------------------------------------------------
function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-xl text-sm font-semibold animate-in slide-in-from-top-2 duration-300 ${
        ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-75 hover:opacity-100 text-lg leading-none">&times;</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle row
// ---------------------------------------------------------------------------
function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary shrink-0 ml-4 ${
          checked ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DonorSettingsPage() {
  // ---- Password state ----
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwPending, startPwTransition] = useTransition();

  // ---- Preferences state ----
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    smsEmergencyAlerts: true,
    emailAppointmentReminders: true,
    emailCampaignInvites: true,
    pushDonationReminders: false,
  });
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [prefsPending, startPrefsTransition] = useTransition();

  // ---- Toast state ----
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 5000);
  };

  // Load preferences on mount
  useEffect(() => {
    getNotificationPreferences().then((p) => {
      setPrefs(p);
      setPrefsLoading(false);
    });
  }, []);

  // ---- Handlers ----
  const handlePasswordChange = () => {
    startPwTransition(async () => {
      const res = await changePassword(currentPw, newPw, confirmPw);
      if (res.success) {
        showToast("Password updated successfully!", true);
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      } else {
        showToast(res.error ?? "Failed to update password.", false);
      }
    });
  };

  const handleSavePrefs = () => {
    startPrefsTransition(async () => {
      const res = await saveNotificationPreferences(prefs);
      if (res.success) showToast("Notification preferences saved!", true);
      else showToast(res.error ?? "Failed to save preferences.", false);
    });
  };

  const pwStrength = (() => {
    if (!newPw) return null;
    if (newPw.length < 8) return { label: "Too short", color: "bg-red-500", width: "w-1/4" };
    if (newPw.length < 12) return { label: "Fair", color: "bg-amber-500", width: "w-1/2" };
    if (/[A-Z]/.test(newPw) && /[0-9]/.test(newPw) && /[^A-Za-z0-9]/.test(newPw))
      return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
    return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
  })();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
          Account &amp; Preferences
        </h1>
        <p className="text-muted-foreground font-medium">
          Manage your security settings and notification preferences.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Security & Password                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" /> Security &amp; Password
          </CardTitle>
          <CardDescription>Update your login credentials. Your current password is required for verification.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current password */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 pr-10 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New + confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength bar */}
              {pwStrength && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${pwStrength.color} ${pwStrength.width} rounded-full transition-all duration-300`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{pwStrength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 pr-10 bg-secondary/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    confirmPw && confirmPw !== newPw ? "border-red-400" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPw && confirmPw !== newPw && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              className="font-bold gap-2"
              disabled={pwPending || !currentPw || !newPw || !confirmPw}
              onClick={handlePasswordChange}
            >
              {pwPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Notification Preferences                                             */}
      {/* ------------------------------------------------------------------ */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Communication Preferences
          </CardTitle>
          <CardDescription>
            Choose how you receive emergency shortage alerts and reminders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {prefsLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <ToggleRow
                icon={Smartphone}
                label="SMS Emergency Shortage Alerts"
                description="Receive instant SMS text messages during critical blood shortages"
                checked={prefs.smsEmergencyAlerts}
                onChange={(v) => setPrefs((p) => ({ ...p, smsEmergencyAlerts: v }))}
              />
              <ToggleRow
                icon={Mail}
                label="Email Appointment Reminders"
                description="Receive confirmation and reminder emails for upcoming donations"
                checked={prefs.emailAppointmentReminders}
                onChange={(v) => setPrefs((p) => ({ ...p, emailAppointmentReminders: v }))}
              />
              <ToggleRow
                icon={Megaphone}
                label="Campaign Invite Emails"
                description="Get notified about new blood drive campaigns near you"
                checked={prefs.emailCampaignInvites}
                onChange={(v) => setPrefs((p) => ({ ...p, emailCampaignInvites: v }))}
              />
              <ToggleRow
                icon={Bell}
                label="Push Donation Reminders"
                description="In-app reminders when you are eligible to donate again"
                checked={prefs.pushDonationReminders}
                onChange={(v) => setPrefs((p) => ({ ...p, pushDonationReminders: v }))}
              />

              <div className="flex justify-end pt-4">
                <Button
                  className="font-bold gap-2"
                  disabled={prefsPending}
                  onClick={handleSavePrefs}
                >
                  {prefsPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Preferences
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
