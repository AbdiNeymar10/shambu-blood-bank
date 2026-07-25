"use client";

import { useState } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Hospital, 
  Phone, 
  Plus 
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_REQUESTS = [
  { id: "req-101", requestNumber: "REQ-2026-001", patientName: "Almaz Tesfaye", hospital: "Shambu General Hospital", bloodGroup: "O-", unitsNeeded: 4, unitsFulfilled: 2, priority: "Critical", status: "Approved", requiredBy: "2026-07-26", contact: "+251 911 112 233" },
  { id: "req-102", requestNumber: "REQ-2026-002", patientName: "Kassahun Bekele", hospital: "Fincha Valley Hospital", bloodGroup: "A+", unitsNeeded: 2, unitsFulfilled: 2, priority: "Urgent", status: "Fulfilled", requiredBy: "2026-07-25", contact: "+251 922 223 344" },
  { id: "req-103", requestNumber: "REQ-2026-003", patientName: "Chaltu Alemu", hospital: "Shambu General Hospital", bloodGroup: "B+", unitsNeeded: 3, unitsFulfilled: 0, priority: "Emergency", status: "Pending", requiredBy: "2026-07-26", contact: "+251 933 334 455" },
  { id: "req-104", requestNumber: "REQ-2026-004", patientName: "Solomon Deresse", hospital: "Nekemte Referral Hospital", bloodGroup: "AB-", unitsNeeded: 1, unitsFulfilled: 0, priority: "Normal", status: "Pending", requiredBy: "2026-07-28", contact: "+251 944 445 566" },
  { id: "req-105", requestNumber: "REQ-2026-005", patientName: "Hawwi Tolossa", hospital: "Shambu General Hospital", bloodGroup: "O+", unitsNeeded: 5, unitsFulfilled: 5, priority: "Urgent", status: "Fulfilled", requiredBy: "2026-07-24", contact: "+251 955 556 677" },
];

export default function AdminBloodRequestsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredRequests = MOCK_REQUESTS.filter(r => {
    if (activeFilter === "Pending") return r.status === "Pending";
    if (activeFilter === "Approved") return r.status === "Approved";
    if (activeFilter === "Fulfilled") return r.status === "Fulfilled";
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Blood Requests Management</h1>
          <p className="text-muted-foreground font-medium">Review emergency blood requests, verify hospital requisitions, and allocate units.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Create Emergency Requisition
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Requests</p>
            <p className="text-2xl font-bold text-foreground mt-1">42</p>
          </div>
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Action</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">8</p>
          </div>
          <Clock className="w-6 h-6 text-amber-500" />
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approved / In Transit</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">14</p>
          </div>
          <AlertCircle className="w-6 h-6 text-blue-500" />
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fulfilled Today</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">20</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-card border border-border p-2 rounded-2xl inline-flex gap-2">
        {["All", "Pending", "Approved", "Fulfilled"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all",
              activeFilter === filter
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {filter} Requests
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/40 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Requisition ID</th>
                <th className="px-6 py-4">Patient / Hospital</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Units (Fulfilled / Needed)</th>
                <th className="px-6 py-4">Priority Level</th>
                <th className="px-6 py-4">Required By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-muted-foreground">
                    {req.requestNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-foreground">{req.patientName}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Hospital className="w-3 h-3" /> {req.hospital}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary text-base">
                    {req.bloodGroup}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    <span className="text-emerald-600 dark:text-emerald-400">{req.unitsFulfilled}</span> / {req.unitsNeeded} Units
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold",
                      req.priority === "Emergency" || req.priority === "Critical" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" :
                      req.priority === "Urgent" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                      "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    )}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    {req.requiredBy}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                      req.status === "Approved" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                      req.status === "Pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    )}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-primary hover:underline">
                      Manage Dispatch
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
