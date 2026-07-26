"use client";

import { useEffect, useState } from "react";
import { 
  History, 
  Download, 
  CheckCircle2, 
  Clock,
  XCircle,
  AlertTriangle,
  Hospital, 
  Calendar,
  Loader2,
  Inbox,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export type DonationItem = {
  id: string;
  date: string;
  rawDate: string;
  center: string;
  type: string;
  volume: string;
  status: string;
  certificate?: string;
  isMock?: boolean;
};

const MOCK_DONATIONS: DonationItem[] = [
  { id: "don-1", date: "2026-03-12", rawDate: "2026-03-12T00:00:00Z", center: "Shambu General Hospital", volume: "450 ml", type: "Whole Blood", certificate: "CERT-2026-089", status: "completed", isMock: true },
  { id: "don-2", date: "2025-11-20", rawDate: "2025-11-20T00:00:00Z", center: "Fincha Valley Drive", volume: "450 ml", type: "Whole Blood", certificate: "CERT-2025-442", status: "completed", isMock: true },
  { id: "don-3", date: "2025-07-15", rawDate: "2025-07-15T00:00:00Z", center: "Shambu General Hospital", volume: "450 ml", type: "Whole Blood", certificate: "CERT-2025-210", status: "completed", isMock: true },
  { id: "don-4", date: "2025-03-01", rawDate: "2025-03-01T00:00:00Z", center: "Shambu General Hospital", volume: "450 ml", type: "Whole Blood", certificate: "CERT-2025-014", status: "completed", isMock: true },
];

export default function DonorDonationsPage() {
  const [donations, setDonations] = useState<DonationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    async function fetchDonations() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setDonations(MOCK_DONATIONS);
          setUsingMock(true);
          setLoading(false);
          return;
        }

        // 1. Get public.users row
        const { data: userRow } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", user.id)
          .maybeSingle();

        const userId = (userRow as { id?: string } | null)?.id;

        if (!userId) {
          setDonations(MOCK_DONATIONS);
          setUsingMock(true);
          setLoading(false);
          return;
        }

        // 2. Get donor_profiles row
        const { data: profileRow } = await supabase
          .from("donor_profiles")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        const donorProfileId = (profileRow as { id?: string } | null)?.id;

        if (!donorProfileId) {
          setDonations(MOCK_DONATIONS);
          setUsingMock(true);
          setLoading(false);
          return;
        }

        // 3. Fetch blood_donations for logged-in donor (sorted newest first)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: dbDonations, error } = await (supabase as any)
          .from("blood_donations")
          .select(`
            id,
            donation_date,
            units_donated,
            status,
            created_at,
            hospitals ( name, city ),
            campaigns ( title, location )
          `)
          .eq("donor_id", donorProfileId)
          .order("donation_date", { ascending: false });

        if (error || !dbDonations || dbDonations.length === 0) {
          setDonations(MOCK_DONATIONS);
          setUsingMock(true);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const parsed: DonationItem[] = dbDonations.map((item: any) => {
            const rawDate = item.donation_date || item.created_at || new Date().toISOString();
            const dateStr = new Date(rawDate).toISOString().split("T")[0];
            const centerName =
              item.hospitals?.name ||
              item.campaigns?.title ||
              "Shambu Regional Blood Center";
            const volumeStr = item.units_donated
              ? `${Math.round(item.units_donated * 450)} ml`
              : "450 ml";

            return {
              id: item.id,
              date: dateStr,
              rawDate,
              center: centerName,
              type: "Whole Blood",
              volume: volumeStr,
              status: (item.status || "completed").toLowerCase(),
              certificate: `CERT-${new Date(rawDate).getFullYear()}-${item.id.slice(0, 4).toUpperCase()}`,
              isMock: false,
            };
          });

          setDonations(parsed);
          setUsingMock(false);
        }
      } catch (err) {
        console.error("Error fetching donation history:", err);
        setDonations(MOCK_DONATIONS);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDonations();
  }, []);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none font-bold">
            <Clock className="w-3.5 h-3.5 mr-1" /> Scheduled
          </Badge>
        );
      case "deferred":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Deferred
          </Badge>
        );
      case "cancelled":
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive border-none font-bold">
            <XCircle className="w-3.5 h-3.5 mr-1" /> {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-secondary text-foreground border-none font-bold">
            {status}
          </Badge>
        );
    }
  };

  const handleDownloadPDF = (cert: string, date: string) => {
    alert(`Downloading Official Certificate ${cert} for donation on ${date}...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
              My Donation History
            </h1>
            {usingMock && !loading && (
              <Badge variant="outline" className="text-xs font-semibold gap-1 border-primary/30 text-primary">
                <Sparkles className="w-3 h-3" /> Sample Records
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground font-medium mt-1">
            View your past voluntary blood donations and download official certificates.
          </p>
        </div>
      </div>

      {/* History Table Card */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-border/60 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Past Donation Records
          </CardTitle>
          {!loading && (
            <span className="text-xs text-muted-foreground font-medium">
              Total: <strong className="text-foreground">{donations.length}</strong> record{donations.length !== 1 ? "s" : ""}
            </span>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading your donation history...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center p-6 gap-3">
              <div className="p-4 rounded-full bg-secondary/80 text-muted-foreground">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-foreground">No Donation Records Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                You haven't recorded any blood donations yet. Schedule an appointment to start saving lives!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary/40 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Collection Center</th>
                    <th className="px-6 py-4">Donation Type</th>
                    <th className="px-6 py-4">Volume</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {donations.map((don) => (
                    <tr key={don.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm text-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-primary" /> {don.date}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Hospital className="w-4 h-4 text-muted-foreground" /> {don.center}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-foreground">
                        {don.type}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">
                        {don.volume}
                      </td>
                      <td className="px-6 py-4">
                        {renderStatusBadge(don.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPDF(don.certificate || "CERT", don.date)}
                          className="font-bold text-primary gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
