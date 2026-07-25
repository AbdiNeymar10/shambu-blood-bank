"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  MapPin, 
  Droplet,
  Plus,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_DONORS = [
  { id: "don-1", name: "Abebe Kebede", email: "abebe.k@gmail.com", phone: "+251 911 234 567", bloodGroup: "O+", city: "Shambu", status: "Available", lastDonated: "2026-03-12", totalDonations: 8 },
  { id: "don-2", name: "Tigist Assefa", email: "tigist.a@gmail.com", phone: "+251 922 345 678", bloodGroup: "A+", city: "Shambu", status: "Deferred", lastDonated: "2026-06-20", totalDonations: 4 },
  { id: "don-3", name: "Dawit Worku", email: "dawit.w@gmail.com", phone: "+251 933 456 789", bloodGroup: "B-", city: "Nekemte", status: "Available", lastDonated: "2026-01-15", totalDonations: 12 },
  { id: "don-4", name: "Genet Tadesse", email: "genet.t@gmail.com", phone: "+251 944 567 890", bloodGroup: "AB+", city: "Shambu", status: "Available", lastDonated: "2025-11-05", totalDonations: 6 },
  { id: "don-5", name: "Beniyn Dibaba", email: "biniyam.d@gmail.com", phone: "+251 955 678 901", bloodGroup: "O-", city: "Fincha", status: "Available", lastDonated: "2026-02-28", totalDonations: 15 },
  { id: "don-6", name: "Marta Bekele", email: "marta.b@gmail.com", phone: "+251 966 789 012", bloodGroup: "A-", city: "Shambu", status: "Unavailable", lastDonated: "2026-07-01", totalDonations: 3 }
];

export default function AdminDonorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");

  const filteredDonors = MOCK_DONORS.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.phone.includes(searchTerm) || d.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === "All" || d.bloodGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Donor Management</h1>
          <p className="text-muted-foreground font-medium">Manage registered blood donors, check eligibility, and contact volunteers.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Register New Donor
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Donors</p>
            <p className="text-2xl font-bold text-foreground">1,248</p>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Eligible & Available</p>
            <p className="text-2xl font-bold text-foreground">892</p>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Recently Donated</p>
            <p className="text-2xl font-bold text-foreground">356</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card border border-border p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search by name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {["All", "O+", "A+", "B+", "O-", "A-", "B-", "AB+"].map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0",
                selectedGroup === group 
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Donor Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/40 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Donor Info</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Donations</th>
                <th className="px-6 py-4">Last Donation</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDonors.map((donor) => (
                <tr key={donor.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-foreground">{donor.name}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {donor.phone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {donor.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs">
                      <Droplet className="w-3 h-3 fill-primary" /> {donor.bloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {donor.city}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                      donor.status === "Available" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                      donor.status === "Deferred" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {donor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-foreground">
                    {donor.totalDonations} Units
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {donor.lastDonated}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-primary hover:underline">
                      View Profile
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
