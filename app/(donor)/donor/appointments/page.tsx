"use client";

import { 
  Calendar as CalendarIcon, 
  Clock, 
  Hospital, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const UPCOMING_APPOINTMENTS = [
  { id: "apt-101", date: "2026-07-26", time: "10:00 AM", center: "Shambu General Hospital Blood Bank", status: "Confirmed", notes: "Regular donation slot" }
];

export default function DonorAppointmentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">My Appointments</h1>
          <p className="text-muted-foreground font-medium">Schedule and manage your blood donation appointments.</p>
        </div>
        <Button className="font-bold gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Book New Appointment
        </Button>
      </div>

      {/* Upcoming Booking Card */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-card to-card shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border-none mb-2">
                Confirmed Appointment
              </Badge>
              <CardTitle className="text-xl font-bold">Upcoming Donation Booking</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {UPCOMING_APPOINTMENTS.map((apt) => (
            <div key={apt.id} className="p-4 rounded-xl bg-card border border-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <CalendarIcon className="w-4 h-4 text-primary" /> {apt.date} at {apt.time}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Hospital className="w-4 h-4 text-primary" /> {apt.center}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{apt.notes}</p>
              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <Button variant="outline" size="sm" className="text-xs font-bold text-destructive hover:bg-destructive/10">
                  Cancel Booking
                </Button>
                <Button size="sm" className="text-xs font-bold">
                  Reschedule
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
