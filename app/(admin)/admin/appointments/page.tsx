"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Hospital, 
  Phone,
  Loader2,
  X,
  AlertTriangle,
  UserCheck,
  Ban,
  UserX,
  Check
} from "lucide-react";
import { 
  getAdminAppointmentsData, 
  updateAppointmentStatus,
  bookAdminAppointment, 
  getBookingOptions,
  type AdminAppointmentsData,
  type AppointmentStatus
} from "@/lib/actions/appointments";
import { cn } from "@/lib/utils";

type ConfirmModalState = {
  isOpen: boolean;
  title: string;
  message: string;
  targetStatus: AppointmentStatus;
  apptId: string;
  confirmLabel: string;
} | null;

export default function AdminAppointmentsPage() {
  const [data, setData] = useState<AdminAppointmentsData>({
    stats: { todaysAppointments: 0, completedToday: 0, pendingConfirmation: 0 },
    appointments: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [processingActionId, setProcessingActionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Confirmation Modal State (Complete Donation, Cancel, No Show)
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(null);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDonors, setBookingDonors] = useState<Array<{ id: string; name: string; phone: string; email?: string; bloodGroup: string }>>([]);
  const [bookingHospitals, setBookingHospitals] = useState<Array<{ id: string; name: string }>>([]);
  const [bookingForm, setBookingForm] = useState({
    donorId: "",
    hospitalId: "",
    date: "",
    time: "09:00",
    notes: "",
  });
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const loadData = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    const result = await getAdminAppointmentsData();
    setData(result);
    if (!isBackground) setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss feedback message after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleOpenBookingModal = async () => {
    setIsBookingOpen(true);
    setBookingError("");
    const options = await getBookingOptions();
    setBookingDonors(options.donors);
    setBookingHospitals(options.hospitals);
    if (options.donors.length > 0 && !bookingForm.donorId) {
      setBookingForm((prev) => ({ ...prev, donorId: options.donors[0].id }));
    }
    if (options.hospitals.length > 0 && !bookingForm.hospitalId) {
      setBookingForm((prev) => ({ ...prev, hospitalId: options.hospitals[0].id }));
    }
    if (!bookingForm.date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setBookingForm((prev) => ({ ...prev, date: tomorrow.toISOString().split("T")[0] }));
    }
  };

  // Perform Appointment Status Transition
  const executeStatusUpdate = async (id: string, targetStatus: AppointmentStatus) => {
    setProcessingActionId(id);
    setFeedback(null);

    const res = await updateAppointmentStatus(id, targetStatus);
    setProcessingActionId(null);

    if (res.success) {
      setFeedback({ type: "success", message: res.message || "Appointment status updated successfully." });
      loadData();
    } else {
      setFeedback({ type: "error", message: res.error || "Unable to update appointment status. Please try again." });
    }
  };

  // Prompt Confirmation for Modal Actions
  const openConfirmation = (
    apptId: string,
    targetStatus: AppointmentStatus,
    title: string,
    message: string,
    confirmLabel: string
  ) => {
    setConfirmModal({
      isOpen: true,
      apptId,
      targetStatus,
      title,
      message,
      confirmLabel,
    });
  };

  const handleConfirmModalAction = () => {
    if (confirmModal) {
      const { apptId, targetStatus } = confirmModal;
      setConfirmModal(null);
      executeStatusUpdate(apptId, targetStatus);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.donorId || !bookingForm.hospitalId || !bookingForm.date) {
      setBookingError("Please select a donor, collection center, and appointment date.");
      return;
    }

    setIsBookingSubmitting(true);
    setBookingError("");

    const res = await bookAdminAppointment(bookingForm);
    setIsBookingSubmitting(false);

    if (res.success) {
      setIsBookingOpen(false);
      setFeedback({ type: "success", message: "Appointment booked successfully." });
      loadData();
    } else {
      setBookingError(res.error || "Failed to book appointment.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Feedback Toast / Alert Banner */}
      {feedback && (
        <div
          className={cn(
            "p-4 rounded-xl border text-sm font-medium flex items-center justify-between shadow-md animate-in slide-in-from-top duration-300",
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          )}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Donation Appointments</h1>
          <p className="text-muted-foreground font-medium">Manage scheduled donor appointments, verify bookings, and process completions.</p>
        </div>
        <button 
          onClick={handleOpenBookingModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto"
        >
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
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : `${data.stats.todaysAppointments} Scheduled`}
            </p>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Completed Today</p>
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : `${data.stats.completedToday} Donors`}
            </p>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending Confirmation</p>
            <p className="text-2xl font-bold text-foreground">
              {isLoading ? "..." : `${data.stats.pendingConfirmation} Bookings`}
            </p>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">Upcoming Appointment Schedule</h3>
          <span className="text-xs font-semibold text-muted-foreground">
            {isLoading ? "Loading..." : `Showing ${data.appointments.length} Appointments`}
          </span>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading appointment schedule...
                  </td>
                </tr>
              ) : data.appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No upcoming appointments found.
                  </td>
                </tr>
              ) : (
                data.appointments.map((apt) => {
                  const raw = apt.rawStatus;
                  return (
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
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                          raw === "confirmed" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" :
                          raw === "checked_in" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" :
                          raw === "completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
                          raw === "cancelled" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" :
                          raw === "no_show" ? "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20" :
                          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" // Scheduled
                        )}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">

                          {/* 1. SCHEDULED STATUS ACTIONS */}
                          {raw === "scheduled" && (
                            <>
                              <button
                                onClick={() => executeStatusUpdate(apt.id, "confirmed")}
                                disabled={processingActionId === apt.id}
                                className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg shadow-xs hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-1 transition-all"
                              >
                                {processingActionId === apt.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                Confirm
                              </button>
                              <button
                                onClick={() => openConfirmation(
                                  apt.id,
                                  "cancelled",
                                  "Cancel Appointment",
                                  `Are you sure you want to cancel the appointment for ${apt.donorName}?`,
                                  "Cancel Appointment"
                                )}
                                disabled={processingActionId === apt.id}
                                className="px-2.5 py-1.5 border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
                                title="Cancel Appointment"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {/* 2. CONFIRMED STATUS ACTIONS */}
                          {raw === "confirmed" && (
                            <>
                              <button
                                onClick={() => executeStatusUpdate(apt.id, "checked_in")}
                                disabled={processingActionId === apt.id}
                                className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold rounded-lg shadow-xs disabled:opacity-50 inline-flex items-center gap-1 transition-all"
                              >
                                {processingActionId === apt.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                                Process Check-in
                              </button>
                              <button
                                onClick={() => openConfirmation(
                                  apt.id,
                                  "no_show",
                                  "Mark as No Show",
                                  `Are you sure you want to mark ${apt.donorName} as No Show?`,
                                  "Mark No Show"
                                )}
                                disabled={processingActionId === apt.id}
                                className="px-2.5 py-1.5 border border-border text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
                                title="Mark No Show"
                              >
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openConfirmation(
                                  apt.id,
                                  "cancelled",
                                  "Cancel Appointment",
                                  `Are you sure you want to cancel the appointment for ${apt.donorName}?`,
                                  "Cancel Appointment"
                                )}
                                disabled={processingActionId === apt.id}
                                className="px-2.5 py-1.5 border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
                                title="Cancel Appointment"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {/* 3. CHECKED IN STATUS ACTIONS */}
                          {raw === "checked_in" && (
                            <button
                              onClick={() => openConfirmation(
                                apt.id,
                                "completed",
                                "Complete Donation",
                                "Are you sure the blood donation process has been completed?",
                                "Complete Donation"
                              )}
                              disabled={processingActionId === apt.id}
                              className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold rounded-lg shadow-xs disabled:opacity-50 inline-flex items-center gap-1 transition-all"
                            >
                              {processingActionId === apt.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              Complete Donation
                            </button>
                          )}

                          {/* 4. COMPLETED STATUS DISPLAY */}
                          {raw === "completed" && (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                          )}

                          {/* 5. CANCELLED STATUS DISPLAY */}
                          {raw === "cancelled" && (
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 inline-flex items-center gap-1">
                              <Ban className="w-3.5 h-3.5" /> Cancelled
                            </span>
                          )}

                          {/* 6. NO SHOW STATUS DISPLAY */}
                          {raw === "no_show" && (
                            <span className="text-xs font-bold text-muted-foreground inline-flex items-center gap-1">
                              <UserX className="w-3.5 h-3.5" /> No Show
                            </span>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Transition Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-md space-y-5 relative">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">{confirmModal.title}</h3>
              <button
                onClick={() => setConfirmModal(null)}
                className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="pt-3 flex justify-end gap-3 border-t border-border">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl border border-input text-sm font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmModalAction}
                className={cn(
                  "px-5 py-2 rounded-xl text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-95 transition-all text-white",
                  confirmModal.targetStatus === "completed" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" :
                  confirmModal.targetStatus === "cancelled" ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20" :
                  "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                )}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Donor Appointment Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-lg space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-bold text-foreground">Book Donor Appointment</h3>
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Donor</label>
                {bookingDonors.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No registered donors found.</p>
                ) : (
                  <select 
                    value={bookingForm.donorId}
                    onChange={(e) => setBookingForm({ ...bookingForm, donorId: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {bookingDonors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.bloodGroup}) — {d.phone || d.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Collection Center / Hospital</label>
                {bookingHospitals.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No hospital locations found.</p>
                ) : (
                  <select 
                    value={bookingForm.hospitalId}
                    onChange={(e) => setBookingForm({ ...bookingForm, hospitalId: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    {bookingHospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Appointment Date</label>
                  <input 
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Appointment Time</label>
                  <input 
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <input 
                  type="text"
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder="e.g. Regular donor visit"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-input text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBookingSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isBookingSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
