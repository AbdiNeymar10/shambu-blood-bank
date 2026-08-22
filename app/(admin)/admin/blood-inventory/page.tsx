"use client";

import { useState, useEffect } from "react";
import { 
  Droplet, 
  Plus, 
  Calendar, 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp,
  Hospital,
  AlertTriangle,
  Loader2,
  X
} from "lucide-react";
import { 
  getAdminInventoryData, 
  addInventoryBatch, 
  getInventoryHospitalOptions,
  type AdminInventoryData 
} from "@/lib/actions/inventory";
import type { BloodGroup, ComponentType } from "@/types/database.types";
import { cn } from "@/lib/utils";

export default function AdminBloodInventoryPage() {
  const [data, setData] = useState<AdminInventoryData>({
    stats: {
      totalAvailable: 0,
      addedThisWeek: 0,
      reservedForPatients: 0,
      criticalShortagesCount: 0,
      criticalGroupsText: "",
      expiringIn7Days: 0,
    },
    items: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Add Batch Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hospitals, setHospitals] = useState<Array<{ id: string; name: string }>>([]);
  const [addForm, setAddForm] = useState<{
    hospitalId: string;
    bloodGroup: BloodGroup;
    componentType: ComponentType;
    unitsAvailable: number;
  }>({
    hospitalId: "",
    bloodGroup: "O+",
    componentType: "whole_blood",
    unitsAvailable: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    const result = await getAdminInventoryData();
    setData(result);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = async () => {
    setIsAddModalOpen(true);
    setFormError("");
    const hospOptions = await getInventoryHospitalOptions();
    setHospitals(hospOptions);
    if (hospOptions.length > 0 && !addForm.hospitalId) {
      setAddForm((prev) => ({ ...prev, hospitalId: hospOptions[0].id }));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.hospitalId || !addForm.bloodGroup || !addForm.componentType || addForm.unitsAvailable <= 0) {
      setFormError("Please fill out all required fields with a positive number of units.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    const res = await addInventoryBatch(addForm);
    setIsSubmitting(false);

    if (res.success) {
      setIsAddModalOpen(false);
      loadData();
    } else {
      setFormError(res.error || "Failed to add inventory batch.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Blood Inventory Management</h1>
          <p className="text-muted-foreground font-medium">Monitor blood units, component reserves, expiry dates, and shortage alerts.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Inventory Batch
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Available</span>
            <Droplet className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">
            {isLoading ? "..." : `${data.stats.totalAvailable} Units`}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +{data.stats.addedThisWeek} units this week
          </p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reserved for Patients</span>
            <Calendar className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-foreground mt-2">
            {isLoading ? "..." : `${data.stats.reservedForPatients} Units`}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Pending emergency dispatch</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Critical Shortages</span>
            <ShieldAlert className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-destructive mt-2">
            {isLoading ? "..." : `${data.stats.criticalShortagesCount} Groups`}
          </p>
          <p className="text-xs text-destructive font-semibold mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> {isLoading ? "Calculating..." : data.stats.criticalGroupsText}
          </p>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expiring in 7 Days</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">
            {isLoading ? "..." : `${data.stats.expiringIn7Days} Units`}
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Batches requiring priority dispatch</p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">Blood Stock Grid</h3>
          <span className="text-xs font-semibold text-muted-foreground">
            {isLoading ? "Loading..." : `Showing ${data.items.length} Active Stock Categories`}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/40 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Component Type</th>
                <th className="px-6 py-4">Hospital / Storage</th>
                <th className="px-6 py-4">Available Units</th>
                <th className="px-6 py-4">Reserved</th>
                <th className="px-6 py-4">Earliest Expiry</th>
                <th className="px-6 py-4">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading blood inventory...
                  </td>
                </tr>
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No active blood inventory found.
                  </td>
                </tr>
              ) : (
                data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary text-base">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
                        <Droplet className="w-4 h-4 fill-primary" /> {item.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      {item.component}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Hospital className="w-3.5 h-3.5" /> {item.hospital}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                      {item.unitsAvailable} Units
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                      {item.unitsReserved} Units
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                      {item.expiry}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                        item.status === "Adequate" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        item.status === "Moderate" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                        item.status === "Low" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                        "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      )}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inventory Batch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-lg space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-bold text-foreground">Add Inventory Batch</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hospital / Storage Center</label>
                {hospitals.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No hospitals found.</p>
                ) : (
                  <select 
                    value={addForm.hospitalId}
                    onChange={(e) => setAddForm({ ...addForm, hospitalId: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Group</label>
                  <select 
                    value={addForm.bloodGroup}
                    onChange={(e) => setAddForm({ ...addForm, bloodGroup: e.target.value as BloodGroup })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Component Type</label>
                  <select 
                    value={addForm.componentType}
                    onChange={(e) => setAddForm({ ...addForm, componentType: e.target.value as ComponentType })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="whole_blood">Whole Blood</option>
                    <option value="packed_red_cells">Packed Red Cells</option>
                    <option value="platelets">Platelets</option>
                    <option value="plasma">Plasma</option>
                    <option value="cryoprecipitate">Cryoprecipitate</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Units to Add</label>
                <input 
                  type="number"
                  min="1"
                  value={addForm.unitsAvailable}
                  onChange={(e) => setAddForm({ ...addForm, unitsAvailable: parseInt(e.target.value, 10) || 1 })}
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-input text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add Stock Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
