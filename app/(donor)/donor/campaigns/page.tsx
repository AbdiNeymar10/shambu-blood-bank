"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import {
  Megaphone,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getDonorCampaigns,
  registerForCampaign,
  cancelCampaignRegistration,
  type CampaignRecord,
  type RegistrationRecord,
} from "@/lib/actions/campaigns";

type PageState = {
  campaigns: CampaignRecord[];
  myRegistrations: Record<string, RegistrationRecord>;
  donorProfileId: string | null;
};

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold",
    upcoming: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none font-bold",
    completed: "bg-gray-500/10 text-gray-500 border-none font-bold",
    cancelled: "bg-red-500/10 text-red-500 border-none font-bold",
  };
  return (
    <Badge className={cfg[status] ?? "bg-muted text-muted-foreground border-none font-bold"}>
      {status.charAt(0).toUpperCase() + status.slice(1)} Campaign
    </Badge>
  );
}

function CampaignCard({
  camp,
  registration,
  onRegister,
  onCancel,
  isPending,
}: {
  camp: CampaignRecord;
  registration?: RegistrationRecord;
  onRegister: (id: string) => void;
  onCancel: (regId: string) => void;
  isPending: boolean;
}) {
  const isRegistered = registration?.status === "registered";
  const isFull = camp.availableSlots === 0 && !isRegistered;
  const bannerImage = camp.imageUrl || "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800";

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
      <div>
        {/* Campaign Banner Picture */}
        <div className="h-44 w-full overflow-hidden relative group">
          <img 
            src={bannerImage} 
            alt={camp.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        </div>

        <CardHeader className="pt-4">
          <div className="flex justify-between items-start mb-2">
            <StatusBadge status={camp.status} />
            <span className="text-xs text-muted-foreground font-semibold">Goal: {camp.targetUnits} Units</span>
          </div>
          <CardTitle className="text-xl font-bold">{camp.title}</CardTitle>
          {camp.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{camp.description}</p>}
        </CardHeader>
      </div>

      <CardContent className="space-y-4 pt-0">
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="text-foreground font-medium">{camp.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span className="text-foreground font-medium">{camp.formattedDates}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary shrink-0" />
            <span className="text-foreground font-medium">{camp.registrationCount} Registered</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
          <span className="text-muted-foreground font-medium">Available Slots</span>
          <span className={`font-bold ${camp.availableSlots === 0 ? "text-red-500" : camp.availableSlots <= 10 ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`}>
            {camp.availableSlots === 0 ? "Full" : `${camp.availableSlots} left`}
          </span>
        </div>

        {isRegistered && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">You are registered</span>
          </div>
        )}

        <div className="pt-1">
          {isRegistered ? (
            <Button
              variant="outline"
              className="w-full font-bold border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              disabled={isPending}
              onClick={() => onCancel(registration!.id)}
            >
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
              Cancel Registration
            </Button>
          ) : (
            <Button
              className="w-full font-bold"
              disabled={isPending || isFull || camp.status === "completed" || camp.status === "cancelled"}
              onClick={() => onRegister(camp.id)}
            >
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              {isFull ? "Campaign Full" : "Register for Campaign"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DonorCampaignsPage() {
  const [state, setState] = useState<PageState | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getDonorCampaigns();
    setState(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRegister = (campaignId: string) => {
    setPendingId(campaignId);
    startTransition(async () => {
      const res = await registerForCampaign(campaignId);
      if (res.success) { showToast("Successfully registered for the campaign!", true); await load(); }
      else showToast(res.error ?? "Registration failed.", false);
      setPendingId(null);
    });
  };

  const handleCancel = (registrationId: string, campaignId: string) => {
    setPendingId(campaignId);
    startTransition(async () => {
      const res = await cancelCampaignRegistration(registrationId);
      if (res.success) { showToast("Registration cancelled.", true); await load(); }
      else showToast(res.error ?? "Cancellation failed.", false);
      setPendingId(null);
    });
  };

  const active = state?.campaigns.filter((c) => c.status === "active") ?? [];
  const upcoming = state?.campaigns.filter((c) => c.status === "upcoming") ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg text-sm font-semibold ${toast.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Blood Drives &amp; Campaigns</h1>
        <p className="text-muted-foreground font-medium">Explore community blood donation campaigns near Shambu and register to donate.</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && state?.campaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <Megaphone className="w-12 h-12 text-muted-foreground/50" />
          <p className="text-lg font-semibold text-muted-foreground">No active campaigns right now</p>
          <p className="text-sm text-muted-foreground">Check back soon — new blood drives are added regularly.</p>
        </div>
      )}

      {!loading && active.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            Active Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {active.map((camp) => (
              <CampaignCard
                key={camp.id}
                camp={camp}
                registration={state?.myRegistrations[camp.id]}
                onRegister={handleRegister}
                onCancel={(regId) => handleCancel(regId, camp.id)}
                isPending={isPending && pendingId === camp.id}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && upcoming.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            Upcoming Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map((camp) => (
              <CampaignCard
                key={camp.id}
                camp={camp}
                registration={state?.myRegistrations[camp.id]}
                onRegister={handleRegister}
                onCancel={(regId) => handleCancel(regId, camp.id)}
                isPending={isPending && pendingId === camp.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
