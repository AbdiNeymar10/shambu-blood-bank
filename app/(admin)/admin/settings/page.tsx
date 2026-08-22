"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Building2,
  Bell,
  User,
  Palette,
  Save,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sun,
  Moon,
  Laptop
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import {
  getAdminSystemSettings,
  saveAdminSystemSettings,
  getNotificationPreferences,
  saveNotificationPreferences,
  changePassword,
  type NotificationPreferences,
} from "@/lib/actions/settings";

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Organization Information State
  const [bloodBankName, setBloodBankName] = useState("");
  const [emergencyHotline, setEmergencyHotline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [address, setAddress] = useState("");

  // Notification Preferences State
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>({
    smsEmergencyAlerts: true,
    emailAppointmentReminders: true,
    emailCampaignInvites: true,
    inventoryShortageAlerts: true,
  });

  // Account State
  const [adminEmail, setAdminEmail] = useState("admin@shambu.com");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading & Feedback
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [isPendingOrg, startOrgTransition] = useTransition();
  const [isPendingNotif, startNotifTransition] = useTransition();
  const [isPendingPwd, startPwdTransition] = useTransition();

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    async function loadData() {
      setLoading(true);

      // Load logged-in admin email
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setAdminEmail(user.email);
      }

      // Load Org Settings & Notification Prefs in parallel
      const [orgRes, notifRes] = await Promise.all([
        getAdminSystemSettings(),
        getNotificationPreferences(),
      ]);

      setBloodBankName(orgRes.bloodBankName);
      setEmergencyHotline(orgRes.emergencyHotline);
      setContactEmail(orgRes.primaryContactEmail);
      setAddress(orgRes.locationAddress);
      setNotifPrefs(notifRes);

      setLoading(false);
    }

    loadData();
  }, []);

  const handleSaveOrg = () => {
    startOrgTransition(async () => {
      const res = await saveAdminSystemSettings({
        bloodBankName,
        emergencyHotline,
        primaryContactEmail: contactEmail,
        locationAddress: address,
        smsProvider: "Ethio Telecom Bulk SMS API",
        senderId: "SHAMBU-BLOOD",
      });

      if (res.success) {
        showToast("Settings saved successfully.", true);
      } else {
        showToast(res.error || "Unable to save settings. Please try again.", false);
      }
    });
  };

  const handleSaveNotifs = () => {
    startNotifTransition(async () => {
      const res = await saveNotificationPreferences(notifPrefs);
      if (res.success) {
        showToast("Notification preferences updated.", true);
      } else {
        showToast(res.error || "Unable to save notification preferences.", false);
      }
    });
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startPwdTransition(async () => {
      const res = await changePassword(currentPassword, newPassword, confirmPassword);
      if (res.success) {
        showToast("Password updated successfully.", true);
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(res.error || "Failed to update password. Please try again.", false);
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-xl text-sm font-semibold transition-all ${toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your Shambu Blood Bank organization and account preferences.</p>
      </div>

      {/* Section 1: Organization Information */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" /> Organization Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Blood Bank Name</label>
            <input
              type="text"
              value={loading ? "Loading..." : bloodBankName}
              onChange={(e) => setBloodBankName(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Emergency Hotline</label>
            <input
              type="text"
              value={loading ? "Loading..." : emergencyHotline}
              onChange={(e) => setEmergencyHotline(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Contact Email</label>
            <input
              type="email"
              value={loading ? "Loading..." : contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Address</label>
            <input
              type="text"
              value={loading ? "Loading..." : address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 font-medium"
            />
          </div>
        </div>

        {/* <div className="flex justify-end pt-2">
          <button 
            onClick={handleSaveOrg}
            disabled={loading || isPendingOrg}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isPendingOrg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div> */}
      </div>

      {/* Section 2: Notification Preferences */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50">
            <div>
              <p className="text-sm font-semibold text-foreground">Emergency Blood Alerts</p>
              <p className="text-xs text-muted-foreground">Receive instant alerts for urgent donor appeals.</p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.smsEmergencyAlerts}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, smsEmergencyAlerts: e.target.checked })}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50">
            <div>
              <p className="text-sm font-semibold text-foreground">Appointment Notifications</p>
              <p className="text-xs text-muted-foreground">Notifications for donor appointment updates.</p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.emailAppointmentReminders}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, emailAppointmentReminders: e.target.checked })}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50">
            <div>
              <p className="text-sm font-semibold text-foreground">Campaign Notifications</p>
              <p className="text-xs text-muted-foreground">Updates on upcoming blood drive campaigns.</p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.emailCampaignInvites}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, emailCampaignInvites: e.target.checked })}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50">
            <div>
              <p className="text-sm font-semibold text-foreground">Inventory Shortage Alerts</p>
              <p className="text-xs text-muted-foreground">Alerts when hospital blood supply drops below critical thresholds.</p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.inventoryShortageAlerts}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, inventoryShortageAlerts: e.target.checked })}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveNotifs}
            disabled={loading || isPendingNotif}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isPendingNotif ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Preferences
          </button>
        </div>
      </div>

      {/* Section 3: Account */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> Account
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-secondary/30 border border-border/50 rounded-xl">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Admin Email</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{adminEmail}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account Role</p>
            <p className="text-sm font-bold text-primary mt-0.5">Administrator</p>
          </div>
        </div>

        <div className="pt-1">
          <button
            onClick={() => setShowPasswordModal(!showPasswordModal)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-foreground hover:bg-secondary/80 font-bold text-xs rounded-xl border border-border transition-all"
          >
            <KeyRound className="w-4 h-4 text-primary" /> Change Password
          </button>
        </div>

        {/* Password Modal / Inline Form */}
        {showPasswordModal && (
          <form onSubmit={handleChangePasswordSubmit} className="mt-4 p-5 rounded-xl bg-muted/40 border border-border space-y-4 animate-in fade-in">
            <h4 className="font-bold text-sm text-foreground">Update Your Security Password</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPendingPwd}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isPendingPwd && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Section 4: Appearance */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" /> Appearance
        </h3>
        <p className="text-xs text-muted-foreground">Customize the theme interface for your dashboard experience.</p>

        {mounted && (
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${theme === "light" ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"}`}
            >
              <Sun className="w-4 h-4" /> Light
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${theme === "dark" ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"}`}
            >
              <Moon className="w-4 h-4" /> Dark
            </button>

            <button
              onClick={() => setTheme("system")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${theme === "system" ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"}`}
            >
              <Laptop className="w-4 h-4" /> System
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
