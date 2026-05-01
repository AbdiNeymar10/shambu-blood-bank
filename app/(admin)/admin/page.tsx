"use client";

import { 
  Users, 
  Droplet, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  summaryStats, 
  bloodStockData, 
  donationTrends, 
  recentRequests, 
  emergencyAlerts 
} from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

const COLORS = ['#ef4444', '#f87171', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#fca5a5', '#fee2e2'];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground font-medium">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Donors" 
          value={summaryStats.totalDonors} 
          icon={Users} 
          trend="+12% from last month" 
          trendType="up"
          color="blue"
        />
        <StatCard 
          title="Pending Requests" 
          value={summaryStats.pendingRequests} 
          icon={FileText} 
          trend="+4 new since morning" 
          trendType="neutral"
          color="orange"
        />
        <StatCard 
          title="Available Units" 
          value={summaryStats.availableBloodUnits} 
          icon={Droplet} 
          trend="-2% from yesterday" 
          trendType="down"
          color="red"
        />
        <StatCard 
          title="Active Campaigns" 
          value={summaryStats.activeCampaigns} 
          icon={TrendingUp} 
          trend="2 finishing soon" 
          trendType="neutral"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Blood Stock Chart */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Blood Group Stock</h3>
                <p className="text-sm text-muted-foreground">Real-time inventory levels by blood type</p>
              </div>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodStockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="group" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="units" radius={[6, 6, 0, 0]}>
                    {bloodStockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold">Recent Blood Requests</h3>
              <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary/30 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Patient / Hospital</th>
                    <th className="px-6 py-4">Group</th>
                    <th className="px-6 py-4">Units</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-secondary/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm">{request.patientName}</div>
                        <div className="text-xs text-muted-foreground">{request.hospital}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary">{request.bloodGroup}</td>
                      <td className="px-6 py-4 text-sm font-medium">{request.units} Units</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold",
                          request.priority === "Critical" ? "bg-red-100 text-red-700" :
                          request.priority === "Urgent" ? "bg-orange-100 text-orange-700" :
                          "bg-blue-100 text-blue-700"
                        )}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
          {/* Emergency Alerts */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm ring-2 ring-primary/5">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-lg font-bold">Emergency Alerts</h3>
            </div>
            <div className="space-y-4">
              {emergencyAlerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">{alert.type}</span>
                    <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
                  </div>
                  <h4 className="text-sm font-bold">{alert.bloodGroup} Shortage</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{alert.message}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Initiate Outreach
            </button>
          </div>

          {/* Donation Trends */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Donation Trends</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    hide
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="donations" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4, stroke: 'hsl(var(--card))' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-700" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Monthly Growth</div>
                  <div className="text-sm font-bold text-green-700">+24.8%</div>
                </div>
              </div>
              <button className="text-xs font-bold text-primary hover:underline">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendType, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 ring-blue-500/20",
    red: "bg-red-50 text-red-600 ring-red-500/20",
    green: "bg-green-50 text-green-600 ring-green-500/20",
    orange: "bg-orange-50 text-orange-600 ring-orange-500/20",
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className={cn("p-3 rounded-xl ring-1", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
          trendType === "up" ? "bg-green-100 text-green-700" : 
          trendType === "down" ? "bg-red-100 text-red-700" : 
          "bg-secondary text-muted-foreground"
        )}>
          {trendType === "up" ? "↑" : trendType === "down" ? "↓" : "•"} {trend.split(' ')[0]}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-muted-foreground text-sm font-medium">{title}</div>
        <div className="text-3xl font-bold mt-1 group-hover:text-primary transition-colors">{value}</div>
        <div className="text-[10px] text-muted-foreground mt-2 font-medium">{trend}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Approved":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
          <Clock className="w-3.5 h-3.5" /> Pending
        </span>
      );
    case "Fulfilled":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Fulfilled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-bold">
          {status}
        </span>
      );
  }
}
