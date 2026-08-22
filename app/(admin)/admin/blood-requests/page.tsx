"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Hospital, 
  Loader2,
  X,
  AlertTriangle,
  PackageCheck,
  Check,
  XCircle
} from "lucide-react";
import { 
  getAdminBloodRequestsData, 
  updateBloodRequestStatus, 
  allocateBloodUnits,
  getInventoryStockForBloodGroup,
  type AdminBloodRequestsData,
  type BloodRequestItem
} from "@/lib/actions/blood-requests";
import type { RequestStatus } from "@/types/database.types";
import { cn } from "@/lib/utils";

export default function AdminBloodRequestsPage() {
  const [data, setData] = useState<AdminBloodRequestsData>({
    stats: { totalRequests: 0, pendingAction: 0, approvedInTransit: 0, fulfilledToday: 0 },
    requests: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"All" | "Pending" | "Approved" | "Fulfilled">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Manage Dispatch Modal State
  const [selectedRequest, setSelectedRequest] = useState<BloodRequestItem | null>(null);
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [allocateUnitsInput, setAllocateUnitsInput] = useState<number>(1);
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    const result = await getAdminBloodRequestsData();
    setData(result);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDispatch = async (req: BloodRequestItem) => {
    setSelectedRequest(req);
    setActionError("");
    const remaining = Math.max(1, req.unitsNeeded - req.unitsFulfilled);
    setAllocateUnitsInput(remaining);

    const stock = await getInventoryStockForBloodGroup(req.bloodGroup);
    setAvailableStock(stock);
  };

  const handleStatusUpdate = async (newStatus: RequestStatus) => {
    if (!selectedRequest) return;
    setIsActionSubmitting(true);
    setActionError("");

    const res = await updateBloodRequestStatus(selectedRequest.id, newStatus);
    setIsActionSubmitting(false);

    if (res.success) {
      setSelectedRequest(null);
      loadData();
    } else {
      setActionError(res.error || "Failed to update status.");
    }
  };

  const handleAllocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    if (allocateUnitsInput <= 0) {
      setActionError("Please enter a valid number of units to allocate.");
      return;
    }

    setIsActionSubmitting(true);
    setActionError("");

    const res = await allocateBloodUnits(selectedRequest.id, allocateUnitsInput);
    setIsActionSubmitting(false);

    if (res.success) {
      setSelectedRequest(null);
      loadData();
    } else {
      setActionError(res.error || "Failed to allocate units.");
    }
  };

  const filteredRequests = data.requests.filter((r) => {
    // 1. Tab status filter
    if (activeFilter === "Pending" && r.status !== "Pending") return false;
    if (activeFilter === "Approved" && r.status !== "Approved") return false;
    if (activeFilter === "Fulfilled" && r.status !== "Fulfilled") return false;

    // 2. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = r.requestNumber.toLowerCase().includes(q);
      const matchPatient = r.patientName.toLowerCase().includes(q);
      const matchHospital = r.hospital.toLowerCase().includes(q);
      const matchBlood = r.bloodGroup.toLowerCase().includes(q);
      return matchNumber || matchPatient || matchHospital || matchBlood;
    }

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
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Requests</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {isLoading ? "..." : data.stats.totalRequests}
            </p>
          </div>
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Action</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {isLoading ? "..." : data.stats.pendingAction}
            </p>
          </div>
          <Clock className="w-6 h-6 text-amber-500" />
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approved / In Transit</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {isLoading ? "..." : data.stats.approvedInTransit}
            </p>
          </div>
          <AlertCircle className="w-6 h-6 text-blue-500" />
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fulfilled Today</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {isLoading ? "..." : data.stats.fulfilledToday}
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="bg-card border border-border p-2 rounded-2xl inline-flex gap-2 self-start sm:self-auto">
          {(["All", "Pending", "Approved", "Fulfilled"] as const).map((filter) => (
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

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search request, patient, hospital..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-card text-xs font-medium outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
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
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading blood requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} blood requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
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
                        req.priority === "Urgent" || req.priority === "High" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
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
                        req.status === "Fulfilled" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      )}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenDispatch(req)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Manage Dispatch
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Dispatch Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">Manage Dispatch</h3>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{selectedRequest.requestNumber}</p>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Details Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-secondary/30 p-4 rounded-xl text-xs">
              <div>
                <span className="text-muted-foreground block">Patient Name</span>
                <span className="font-semibold text-foreground text-sm">{selectedRequest.patientName}</span>
                {selectedRequest.patientAge && <span className="text-muted-foreground block">Age: {selectedRequest.patientAge}</span>}
              </div>
              <div>
                <span className="text-muted-foreground block">Hospital</span>
                <span className="font-semibold text-foreground text-sm">{selectedRequest.hospital}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Blood Group</span>
                <span className="font-bold text-primary text-base">{selectedRequest.bloodGroup}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Priority Level</span>
                <span className={cn(
                  "font-semibold",
                  selectedRequest.priority === "Emergency" || selectedRequest.priority === "Critical" ? "text-rose-600 dark:text-rose-400" :
                  selectedRequest.priority === "Urgent" || selectedRequest.priority === "High" ? "text-amber-600 dark:text-amber-400" :
                  "text-blue-600 dark:text-blue-400"
                )}>{selectedRequest.priority}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Required By</span>
                <span className="font-semibold text-foreground">{selectedRequest.requiredBy}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Fulfillment Progress</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedRequest.unitsFulfilled} / {selectedRequest.unitsNeeded} Units</span>
              </div>
            </div>

            {/* Inventory Stock Info */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Available Inventory Stock ({selectedRequest.bloodGroup}):</span>
              <span className="font-bold text-primary text-sm">{availableStock} Units</span>
            </div>

            {/* Action Workflows */}
            {selectedRequest.status === "Pending" ? (
              <div className="space-y-3 pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium">This request is pending administrative review. Approve or reject to proceed.</p>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    disabled={isActionSubmitting}
                    onClick={() => handleStatusUpdate("rejected")}
                    className="px-4 py-2.5 rounded-xl border border-destructive/30 text-destructive text-xs font-semibold hover:bg-destructive/10 transition-colors flex items-center gap-1.5"
                  >
                    {isActionSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                    Reject Request
                  </button>
                  <button
                    type="button"
                    disabled={isActionSubmitting}
                    onClick={() => handleStatusUpdate("approved")}
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    {isActionSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Approve Request
                  </button>
                </div>
              </div>
            ) : selectedRequest.unitsFulfilled < selectedRequest.unitsNeeded ? (
              <form onSubmit={handleAllocateSubmit} className="space-y-4 pt-2 border-t border-border">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Allocate Units from Inventory</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number"
                      min="1"
                      max={Math.max(1, selectedRequest.unitsNeeded - selectedRequest.unitsFulfilled)}
                      value={allocateUnitsInput}
                      onChange={(e) => setAllocateUnitsInput(parseInt(e.target.value, 10) || 1)}
                      className="w-32 h-11 px-4 rounded-xl border border-input bg-background text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-xs text-muted-foreground font-medium">
                      (Remaining needed: {selectedRequest.unitsNeeded - selectedRequest.unitsFulfilled} Units)
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2.5 rounded-xl border border-input text-xs font-semibold hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isActionSubmitting || availableStock <= 0}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {isActionSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PackageCheck className="w-3.5 h-3.5" />}
                    Allocate & Dispatch Units
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                This requisition has been fully fulfilled ({selectedRequest.unitsFulfilled} / {selectedRequest.unitsNeeded} Units).
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
