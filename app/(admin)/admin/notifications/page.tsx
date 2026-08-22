"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Users, 
  Clock, 
  Loader2,
  AlertTriangle
} from "lucide-react";
import { 
  dispatchBroadcastAlert, 
  getAdminNotificationLogs,
  type TargetAudienceOption,
  type AdminNotificationLog
} from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";

export default function AdminNotificationsPage() {
  const [logs, setLogs] = useState<AdminNotificationLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  // Broadcast Form State
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState<TargetAudienceOption>("All Donors (Universal)");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  const loadLogs = async () => {
    setIsLoadingLogs(true);
    const data = await getAdminNotificationLogs();
    setLogs(data);
    setIsLoadingLogs(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setErrorMsg("Please enter notification title and message content.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const res = await dispatchBroadcastAlert({ title, audience, message });
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(`Broadcast successfully dispatched to ${res.count || 0} recipient donor(s).`);
      setTitle("");
      setMessage("");
      loadLogs();
    } else {
      setErrorMsg(res.error || "Failed to dispatch broadcast alert.");
    }
  };

  const handleFocusForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
      const titleInput = formRef.current.querySelector("input");
      if (titleInput) titleInput.focus();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Notification & Alert Center</h1>
          <p className="text-muted-foreground font-medium">Broadcast emergency blood shortage appeals, SMS reminders, and system notifications.</p>
        </div>
        <button 
          onClick={handleFocusForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto"
        >
          <Send className="w-4 h-4" /> Send Emergency Broadcast
        </button>
      </div>

      {/* Broadcast Form Card */}
      <div ref={formRef} className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" /> Create New Broadcast Alert
        </h3>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleDispatch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Notification Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Urgent O+ Blood Appeal at Shambu General" 
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Target Audience</label>
              <select 
                value={audience}
                onChange={(e) => setAudience(e.target.value as TargetAudienceOption)}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="All Donors (Universal)">All Donors (Universal)</option>
                <option value="A+ Positive Donors Only">A+ Positive Donors Only</option>
                <option value="A- Negative Donors Only">A- Negative Donors Only</option>
                <option value="B+ Positive Donors Only">B+ Positive Donors Only</option>
                <option value="B- Negative Donors Only">B- Negative Donors Only</option>
                <option value="AB+ Positive Donors Only">AB+ Positive Donors Only</option>
                <option value="AB- Negative Donors Only">AB- Negative Donors Only</option>
                <option value="O+ Positive Donors Only">O+ Positive Donors Only</option>
                <option value="O- Negative Donors Only">O- Negative Donors Only</option>
                <option value="Shambu City Donors Only">Shambu City Donors Only</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Message Content</label>
            <textarea 
              rows={3} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type emergency message details for SMS and Push notifications..." 
              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl shadow-md hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Dispatch Broadcast
            </button>
          </div>
        </form>
      </div>

      {/* History Log */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent Sent Notifications</h3>
          <span className="text-xs font-semibold text-muted-foreground">Broadcast Log</span>
        </div>
        {isLoadingLogs ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" /> Loading broadcast log...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No broadcast notifications have been sent yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((notif) => (
              <div key={notif.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      notif.type === "Emergency Alert" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" :
                      notif.type === "Campaign Invite" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                      "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    )}>
                      {notif.type}
                    </span>
                    <span className="text-xs text-muted-foreground"><Clock className="w-3 h-3 inline" /> {notif.date}</span>
                  </div>
                  <h4 className="font-bold text-foreground text-sm">{notif.title}</h4>
                  <p className="text-xs text-muted-foreground">Target: <Users className="w-3 h-3 inline" /> {notif.audience}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {notif.delivered} Delivered
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
