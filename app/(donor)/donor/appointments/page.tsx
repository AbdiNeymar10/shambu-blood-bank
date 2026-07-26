"use client";

import { useEffect, useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Hospital as HospitalIcon, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  AlertCircle,
  X,
  Loader2,
  CalendarCheck,
  AlertTriangle,
  XCircle,
  Sparkles,
  Inbox,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getDonorAppointments,
  getHospitals,
  createAppointment,
  cancelAppointment,
  rescheduleAppointment,
  type AppointmentRecord,
  type HospitalItem,
  type AppointmentStatus,
} from "@/lib/actions/appointments";

const TIME_SLOTS = [
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

export default function DonorAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [hospitals, setHospitals] = useState<HospitalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  // Modals & Action States
  const [showBookModal, setShowBookModal] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<AppointmentRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Booking Form State
  const [bookHospitalId, setBookHospitalId] = useState("");
  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("10:00");
  const [bookNotes, setBookNotes] = useState("");

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("10:00");

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [aptRes, hospRes] = await Promise.all([
        getDonorAppointments(),
        getHospitals(),
      ]);

      setAppointments(aptRes.appointments);
      setUsingMock(aptRes.usingMock);
      setHospitals(hospRes);

      if (hospRes.length > 0) {
        setBookHospitalId(hospRes[0].id);
      }
    } catch (err) {
      console.error("Failed to load appointments data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Booking Submit
  async function handleBookSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!bookHospitalId) {
      setFormError("Please select a donation center / hospital.");
      return;
    }
    if (!bookDate) {
      setFormError("Please select a date for your appointment.");
      return;
    }
    if (!bookTime) {
      setFormError("Please select a time slot.");
      return;
    }

    const selectedDateTime = new Date(`${bookDate}T${bookTime}:00`);
    if (selectedDateTime < new Date()) {
      setFormError("Appointment date and time must be in the future.");
      return;
    }

    setActionLoading(true);
    const res = await createAppointment(
      bookHospitalId,
      bookDate,
      bookTime,
      bookNotes
    );
    setActionLoading(false);

    if (!res.success) {
      setFormError(res.error || "Failed to book appointment.");
    } else {
      setShowBookModal(false);
      setBookNotes("");
      loadData();
    }
  }

  // Handle Cancel Appointment
  async function handleCancel(aptId: string) {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    setActionLoading(true);
    const res = await cancelAppointment(aptId);
    setActionLoading(false);

    if (!res.success) {
      alert(res.error || "Failed to cancel appointment.");
    } else {
      loadData();
    }
  }

  // Handle Reschedule Submit
  async function handleRescheduleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rescheduleTarget) return;
    setFormError(null);

    if (!rescheduleDate) {
      setFormError("Please select a new date.");
      return;
    }
    if (!rescheduleTime) {
      setFormError("Please select a new time slot.");
      return;
    }

    const selectedDateTime = new Date(`${rescheduleDate}T${rescheduleTime}:00`);
    if (selectedDateTime < new Date()) {
      setFormError("Rescheduled date and time must be in the future.");
      return;
    }

    setActionLoading(true);
    const res = await rescheduleAppointment(
      rescheduleTarget.id,
      rescheduleDate,
      rescheduleTime
    );
    setActionLoading(false);

    if (!res.success) {
      setFormError(res.error || "Failed to reschedule appointment.");
    } else {
      setRescheduleTarget(null);
      loadData();
    }
  }

  const renderStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
      case "approved":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border-none">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
          </Badge>
        );
      case "scheduled":
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border-none">
            <Clock className="w-3.5 h-3.5 mr-1" /> Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
          </Badge>
        );
      case "cancelled":
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive border-none font-bold">
            <XCircle className="w-3.5 h-3.5 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-secondary text-foreground border-none font-bold">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
              My Appointments
            </h1>
            {usingMock && !loading && (
              <Badge variant="outline" className="text-xs font-semibold gap-1 border-primary/30 text-primary">
                <Sparkles className="w-3 h-3" /> Sample Records
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground font-medium mt-1">
            Schedule and manage your blood donation appointments.
          </p>
        </div>
        <Button
          onClick={() => {
            setFormError(null);
            setShowBookModal(true);
          }}
          className="font-bold gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Book New Appointment
        </Button>
      </div>

      {/* Appointments List Card */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-card to-card shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-border/60">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-primary" /> My Booking Records
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Showing appointments for your logged-in donor profile.
              </CardDescription>
            </div>
            {!loading && (
              <span className="text-xs text-muted-foreground font-medium">
                Total: <strong className="text-foreground">{appointments.length}</strong>
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading your appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center p-6 gap-3">
              <div className="p-4 rounded-full bg-secondary/80 text-muted-foreground">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-foreground">No Upcoming Appointments</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                You don't have any active appointments scheduled. Book a time slot to donate blood.
              </p>
              <Button
                onClick={() => setShowBookModal(true)}
                size="sm"
                className="mt-2 font-bold gap-2"
              >
                <Plus className="w-4 h-4" /> Book Appointment Now
              </Button>
            </div>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-xl bg-card border border-border space-y-3 hover:border-primary/40 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <CalendarIcon className="w-4 h-4 text-primary shrink-0" />
                    <span>{apt.formattedDate} at {apt.formattedTime}</span>
                  </div>
                  <div>{renderStatusBadge(apt.status)}</div>
                </div>

                <div className="flex items-start gap-2 text-muted-foreground text-xs pt-1">
                  <HospitalIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">{apt.hospitalName}</span>
                    {apt.hospitalAddress && (
                      <span className="block text-[11px] text-muted-foreground">
                        {apt.hospitalAddress}
                      </span>
                    )}
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-xs text-muted-foreground bg-secondary/40 p-2.5 rounded-lg border border-border/40">
                    {apt.notes}
                  </p>
                )}

                {apt.status !== "cancelled" && apt.status !== "completed" && (
                  <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(apt.id)}
                      disabled={actionLoading}
                      className="text-xs font-bold text-destructive hover:bg-destructive/10 border-destructive/30"
                    >
                      Cancel Booking
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setFormError(null);
                        const existingDate = apt.appointmentDate
                          ? new Date(apt.appointmentDate).toISOString().split("T")[0]
                          : "";
                        setRescheduleDate(existingDate);
                        setRescheduleTarget(apt);
                      }}
                      disabled={actionLoading}
                      className="text-xs font-bold gap-1"
                    >
                      Reschedule
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Modal 1: Book New Appointment */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Book Blood Donation
              </h2>
              <button
                onClick={() => setShowBookModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                  Donation Center / Hospital *
                </label>
                <select
                  value={bookHospitalId}
                  onChange={(e) => setBookHospitalId(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                    Time Slot *
                  </label>
                  <select
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  placeholder="E.g., Preferred whole blood donation, first-time donor notes..."
                  rows={2}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBookModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={actionLoading}
                  className="font-bold gap-2"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Reschedule Appointment */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Reschedule Appointment
              </h2>
              <button
                onClick={() => setRescheduleTarget(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-5 space-y-4">
              <p className="text-xs text-muted-foreground">
                Rescheduling for: <strong className="text-foreground">{rescheduleTarget.hospitalName}</strong>
              </p>

              {formError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                    New Date *
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider">
                    New Time Slot *
                  </label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRescheduleTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={actionLoading}
                  className="font-bold gap-2"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Rescheduled Time"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
