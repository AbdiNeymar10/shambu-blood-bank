"use client";

import { useEffect, useState } from "react";
import { 
  BarChart as BarChartIcon, 
  Download, 
  TrendingUp, 
  Droplet, 
  Users, 
  Calendar, 
  FileCheck 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { getAdminReportsData, type AdminReportsData } from "@/lib/actions/reports";

const COLORS = ['#ef4444', '#f87171', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#fca5a5'];

export default function AdminReportsPage() {
  const [data, setData] = useState<AdminReportsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      const res = await getAdminReportsData();
      setData(res);
      setLoading(false);
    }
    loadReports();
  }, []);

  const handleExportCSV = () => {
    if (!data) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const csvRows: string[] = [];

    csvRows.push("Shambu Blood Bank - Analytics & Reports Export");
    csvRows.push(`Export Date,${todayStr}`);
    csvRows.push("");
    
    csvRows.push("KEY PERFORMANCE INDICATORS");
    csvRows.push("Metric,Value,Description");
    csvRows.push(`Fulfillment Rate,${data.fulfillmentRate},"${data.fulfillmentSubtext}"`);
    csvRows.push(`Total Donated YTD,${data.totalDonatedYTD},"${data.totalDonatedSubtext}"`);
    csvRows.push(`New Donors YTD,${data.newDonorsYTD},"${data.donorGrowthText}"`);
    csvRows.push("");

    csvRows.push("MONTHLY BLOOD REQUEST VS FULFILLMENT");
    csvRows.push("Month,Requested Units,Fulfilled Units,Fulfillment %");
    data.monthlyFulfillment.forEach((m) => {
      const pct = m.requested > 0 ? ((m.fulfilled / m.requested) * 100).toFixed(1) : "0.0";
      csvRows.push(`${m.month},${m.requested},${m.fulfilled},${pct}%`);
    });
    csvRows.push("");

    csvRows.push("DONOR BLOOD GROUP SHARE");
    csvRows.push("Blood Group,Percentage Share");
    data.bloodDistribution.forEach((b) => {
      csvRows.push(`${b.name},${b.value}%`);
    });

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `shambu_analytics_report_${todayStr}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const monthlyFulfillment = data?.monthlyFulfillment || [
    { month: "Jan", requested: 0, fulfilled: 0 },
  ];

  const bloodDistribution = data?.bloodDistribution || [
    { name: "O+", value: 0 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Analytics & Reports</h1>
          <p className="text-muted-foreground font-medium">Export monthly donation statistics, blood request fulfillment rates, and audit logs.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={loading || !data}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fulfillment Rate</span>
            <FileCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">
            {loading ? "..." : (data?.fulfillmentRate || "0.0%")}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            {loading ? "Calculating..." : (data?.fulfillmentSubtext || "Operational fulfillment")}
          </p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Donated YTD</span>
            <Droplet className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">
            {loading ? "..." : (data?.totalDonatedYTD || "0 Units")}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            {loading ? "Calculating..." : (data?.totalDonatedSubtext || "Across Shambu & regional drives")}
          </p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Donors YTD</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">
            {loading ? "..." : (data?.newDonorsYTD || "0 Donors")}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
            {loading ? "Calculating..." : (data?.donorGrowthText || "New this year")}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request vs Fulfillment Bar Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-1">Blood Request vs Fulfillment</h3>
          <p className="text-xs text-muted-foreground mb-6">Monthly requested units versus dispatched units</p>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFulfillment}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
                <Bar dataKey="requested" fill="#f87171" radius={[4, 4, 0, 0]} name="Requested Units" />
                <Bar dataKey="fulfilled" fill="#22c55e" radius={[4, 4, 0, 0]} name="Fulfilled Units" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Group Distribution Pie Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-1">Donor Blood Group Share</h3>
          <p className="text-xs text-muted-foreground mb-6">Percentage breakdown of registered donors by blood type</p>
          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bloodDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {bloodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
