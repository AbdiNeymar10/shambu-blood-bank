"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchFilter() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location / Center</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select className="w-full h-11 pl-10 pr-4 rounded-md border border-input bg-background appearance-none text-sm">
              <option value="all">All Centers (Citywide)</option>
              <option value="north">North Branch Clinic</option>
              <option value="south">South Memorial Hospital</option>
              <option value="east">Eastside Blood Center</option>
              <option value="west">West Valley Facility</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Blood Type</label>
          <select className="w-full h-11 px-4 rounded-md border border-input bg-background appearance-none text-sm">
            <option value="all">All Blood Types</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <Button className="h-11 w-full">
          <Search className="w-4 h-4 mr-2" />
          Filter Inventory
        </Button>

      </div>
    </div>
  );
}
