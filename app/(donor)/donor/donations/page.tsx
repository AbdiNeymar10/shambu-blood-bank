"use client";

import { 
  History, 
  Droplet, 
  Download, 
  CheckCircle2, 
  Hospital, 
  Calendar 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PAST_DONATIONS = [
  { id: "don-1", date: "2026-03-12", center: "Shambu General Hospital", volume: "450 ml", type: "Whole Blood", certificate: "CERT-2026-089" },
  { id: "don-2", date: "2025-11-20", center: "Fincha Valley Drive", volume: "450 ml", type: "Whole Blood", certificate: "CERT-2025-442" },
  { id: "don-3", date: "2025-07-15", center: "Shambu General Hospital", volume: "450 ml", type: "Whole Blood", certificate: "CERT-2025-210" },
  { id: "don-4", date: "2025-03-01", center: "Shambu General Hospital", volume: "450 ml", type: "Whole Blood", certificate: "CERT-2025-014" },
];

export default function DonorDonationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">My Donation History</h1>
          <p className="text-muted-foreground font-medium">View your past voluntary blood donations and download official certificates.</p>
        </div>
      </div>

      {/* History Table */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-border/60">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Past Donation Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                {PAST_DONATIONS.map((don) => (
                  <tr key={don.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-sm text-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {don.date}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Hospital className="w-4 h-4 text-muted-foreground" /> {don.center}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-foreground">
                      {don.type}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">
                      {don.volume}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="font-bold text-primary gap-1">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
