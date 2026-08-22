"use client";

import { useState, useEffect } from "react";
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
  Calendar,
  Loader2,
  X,
  AlertTriangle,
  FileText
} from "lucide-react";
import { 
  getAdminDonorsData, 
  registerAdminDonor, 
  getDonorProfileDetails,
  type AdminDonorsData,
  type DonorTableItem,
  type DonorProfileDetails
} from "@/lib/actions/donors";
import type { BloodGroup } from "@/types/database.types";
import { cn } from "@/lib/utils";

export default function AdminDonorsPage() {
  const [data, setData] = useState<AdminDonorsData>({
    stats: { totalDonors: 0, eligibleAndAvailable: 0, recentlyDonated: 0 },
    donors: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");

  // Register Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState<{
    fullName: string;
    email: string;
    phone: string;
    bloodGroup: BloodGroup;
    city: string;
  }>({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "O+",
    city: "Shambu",
  });
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState("");

  // Profile View Modal State
  const [selectedDonorProfile, setSelectedDonorProfile] = useState<DonorProfileDetails | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const result = await getAdminDonorsData();
    setData(result);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setRegisterError("");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.fullName || !registerForm.email || !registerForm.phone) {
      setRegisterError("Please enter full name, email address, and phone number.");
      return;
    }

    setIsRegisterSubmitting(true);
    setRegisterError("");

    const res = await registerAdminDonor(registerForm);
    setIsRegisterSubmitting(false);

    if (res.success) {
      setIsRegisterModalOpen(false);
      setRegisterForm({ fullName: "", email: "", phone: "", bloodGroup: "O+", city: "Shambu" });
      loadData();
    } else {
      setRegisterError(res.error || "Failed to register donor.");
    }
  };

  const handleViewProfile = async (donorId: string) => {
    setIsProfileLoading(true);
    const profile = await getDonorProfileDetails(donorId);
    setSelectedDonorProfile(profile);
    setIsProfileLoading(false);
  };

  const filteredDonors = data.donors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase());
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
        <button 
          onClick={handleOpenRegisterModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto"
        >
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
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : data.stats.totalDonors}
            </p>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Eligible & Available</p>
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : data.stats.eligibleAndAvailable}
            </p>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Recently Donated</p>
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : data.stats.recentlyDonated}
            </p>
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
          {["All", "O+", "A+", "B+", "O-", "A-", "B-", "AB+", "AB-"].map((group) => (
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading registered donors...
                  </td>
                </tr>
              ) : filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No registered donors found {selectedGroup !== "All" ? `for blood group ${selectedGroup}` : ""}.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((donor) => (
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
                      <button 
                        onClick={() => handleViewProfile(donor.id)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register New Donor Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-lg space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-bold text-foreground">Register New Donor</h3>
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {registerError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{registerError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input 
                  type="text"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  placeholder="e.g. Abebe Kebede"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input 
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="donor@example.com"
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input 
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    placeholder="+251 911 000 000"
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <select 
                    value={registerForm.bloodGroup}
                    onChange={(e) => setRegisterForm({ ...registerForm, bloodGroup: e.target.value as BloodGroup })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City / Location</label>
                  <input 
                    type="text"
                    value={registerForm.city}
                    onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                    placeholder="Shambu"
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-input text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegisterSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isRegisterSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {selectedDonorProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedDonorProfile.donor.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>{selectedDonorProfile.donor.email}</span> • <span>{selectedDonorProfile.donor.phone}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedDonorProfile(null)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-3 gap-4 bg-secondary/30 p-4 rounded-xl text-xs">
              <div>
                <span className="text-muted-foreground block">Blood Group</span>
                <span className="font-bold text-primary text-base">{selectedDonorProfile.donor.bloodGroup}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Location</span>
                <span className="font-semibold text-foreground">{selectedDonorProfile.donor.city}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Eligibility Status</span>
                <span className={cn(
                  "font-bold",
                  selectedDonorProfile.donor.status === "Available" ? "text-emerald-600 dark:text-emerald-400" :
                  selectedDonorProfile.donor.status === "Deferred" ? "text-amber-600 dark:text-amber-400" :
                  "text-muted-foreground"
                )}>{selectedDonorProfile.donor.status}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Total Units Donated</span>
                <span className="font-bold text-foreground text-sm">{selectedDonorProfile.donor.totalDonations} Units</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block">Last Donation Date</span>
                <span className="font-semibold text-foreground">{selectedDonorProfile.donor.lastDonated}</span>
              </div>
            </div>

            {/* Donation History List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Donation History
              </h4>
              {selectedDonorProfile.donations.length === 0 ? (
                <p className="text-xs text-muted-foreground italic bg-secondary/20 p-4 rounded-xl text-center">
                  No completed donation records found for this donor.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedDonorProfile.donations.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-foreground block">{item.hospitalName}</span>
                        <span className="text-muted-foreground">{item.donationDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 block">{item.unitsDonated} Unit(s)</span>
                        <span className="text-muted-foreground font-mono">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end border-t border-border">
              <button
                onClick={() => setSelectedDonorProfile(null)}
                className="px-5 py-2 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
