"use client";

import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Hospital, 
  Phone 
} from "lucide-react";
import { cn } from "@/lib/utils";

const APPOINTMENTS = [
  { id: "apt-1", donorName: "Abebe Kebede", bloodGroup: "O+", date: "2026-07-26", time: "09:00 AM", center: "Shambu General Hospital", status: "Confirmed", phone: "+251 911 234 567" },
  { id: "apt-2", donorName: "Tigist Assefa", bloodGroup: "A+", date: "2026-07-26", time: "10:30 AM", center: "Shambu General Hospital", status: "Scheduled", phone: "+251 922 345 678" },
  { id: "apt-3", donorName: "Dawit Worku", bloodGroup: "B-", date: "2026-07-26", time: "02:00 PM", center: "Fincha Valley Mobile Unit", status: "Scheduled", phone: "+251 933 456 789" },
  { id: "apt-4", donorName: "Genet Tadesse", bloodGroup: "AB+", date: "2026-07-27", time: "11:00 AM", center: "Shambu General Hospital", status: "Confirmed", phone: "+251 944 567 890" },
  { id: "apt-5", donorName: "Beniyn Dibaba", bloodGroup: "O-", date: "2026-07-27", time: "03:30 PM", center: "Nekemte Referral Center", status: "Completed", phone: "+251 955 678 901" },
];

export default function AdminAppointmentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Donation Appointments</h1>
          <p className="text-muted-foreground font-medium">Manage scheduled donor appointments, verify bookings, and process completions.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Book Donor Appointment
        </button>
      </div>

      {/* Appointment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Today's Appointments</p>
            <p className="text-2xl font-bold text-foreground">14 Scheduled</p>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Completed Today</p>
            <p className="text-2xl font-bold text-foreground">9 Donors</p>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending Confirmation</p>
            <p className="text-2xl font-bold text-foreground">5 Bookings</p>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">Upcoming Appointment Schedule</h3>
          <span className="text-xs font-semibold text-muted-foreground">Showing 5 Appointments</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/40 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Donor Name</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Collection Center</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {APPOINTMENTS.map((apt) => (
                <tr key={apt.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-foreground">{apt.donorName}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {apt.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary text-base">
                    {apt.bloodGroup}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    <div>{apt.date}</div>
                    <div className="text-xs text-muted-foreground">{apt.time}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Hospital className="w-3.5 h-3.5" /> {apt.center}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                      apt.status === "Confirmed" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                      apt.status === "Completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                      "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    )}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-primary hover:underline">
                      Process Check-in
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
