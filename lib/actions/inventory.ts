"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { BloodGroup, ComponentType } from "@/types/database.types";

export type InventoryGridItem = {
  id: string;
  bloodGroup: BloodGroup;
  component: string;
  rawComponent: ComponentType;
  unitsAvailable: number;
  unitsReserved: number;
  expiry: string;
  status: "Adequate" | "Moderate" | "Low" | "Critical Shortage";
  hospital: string;
  hospitalId: string;
};

export type AdminInventoryData = {
  stats: {
    totalAvailable: number;
    addedThisWeek: number;
    reservedForPatients: number;
    criticalShortagesCount: number;
    criticalGroupsText: string;
    expiringIn7Days: number;
  };
  items: InventoryGridItem[];
};

const ALL_BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function formatComponentType(comp: ComponentType): string {
  switch (comp) {
    case "whole_blood": return "Whole Blood";
    case "packed_red_cells": return "Packed Red Cells";
    case "platelets": return "Platelets";
    case "plasma": return "Plasma";
    case "cryoprecipitate": return "Cryoprecipitate";
    default: return String(comp || "Whole Blood").replace(/_/g, " ");
  }
}

function getExpiryInfo(rowExpiry: string | null, updatedAtStr: string | null, comp: ComponentType): { expiryFormatted: string; isExpiringSoon: boolean } {
  let expiryDate: Date;

  if (rowExpiry) {
    expiryDate = new Date(rowExpiry);
  } else {
    const baseDate = updatedAtStr ? new Date(updatedAtStr) : new Date();
    let shelfDays = 35;
    if (comp === "platelets") shelfDays = 7;
    else if (comp === "whole_blood" || comp === "packed_red_cells") shelfDays = 35;
    else if (comp === "plasma" || comp === "cryoprecipitate") shelfDays = 365;

    expiryDate = new Date(baseDate.getTime() + shelfDays * 24 * 60 * 60 * 1000);
  }

  const now = new Date();
  const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = diffDays >= 0 && diffDays <= 7;
  const expiryFormatted = isNaN(expiryDate.getTime()) ? "2026-09-01" : expiryDate.toISOString().split("T")[0];

  return { expiryFormatted, isExpiringSoon };
}

/**
 * Fetches summary statistics and live blood inventory grid items from Supabase.
 */
export async function getAdminInventoryData(): Promise<AdminInventoryData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoISO = weekAgo.toISOString();

    const [inventoryRes, requestsRes] = await Promise.all([
      // 1. Fetch inventory rows
      supabase
        .from("blood_inventory")
        .select("id, blood_group, component_type, units_available, units_reserved, expiry_date, created_at, updated_at, hospital_id, hospitals(id, name, address)")
        .order("units_available", { ascending: true }),

      // 2. Fetch pending & approved blood requests for reservations
      supabase
        .from("blood_requests")
        .select("blood_group, units_needed, units_fulfilled, status")
        .in("status", ["pending", "approved"]),
    ]);

    const inventoryRows = inventoryRes.data || [];
    const requestRows = requestsRes.data || [];

    // Calculate total reserved per blood group from active requests
    const reservedPerGroup: Record<string, number> = {};
    let totalReserved = 0;

    requestRows.forEach((req: any) => {
      const bg = req.blood_group as string;
      const needed = req.units_needed || 0;
      const fulfilled = req.units_fulfilled || 0;
      const remaining = Math.max(0, needed - fulfilled);

      reservedPerGroup[bg] = (reservedPerGroup[bg] || 0) + remaining;
      totalReserved += remaining;
    });

    let totalAvailable = 0;
    let addedThisWeek = 0;
    let expiringIn7Days = 0;
    const totalsPerGroup: Record<string, number> = {};

    const items: InventoryGridItem[] = inventoryRows.map((row: any) => {
      const bg = row.blood_group as BloodGroup;
      const comp = (row.component_type || "whole_blood") as ComponentType;
      const units = row.units_available || 0;
      const hospitalObj = Array.isArray(row.hospitals) ? row.hospitals[0] : row.hospitals;
      const hospitalName = hospitalObj?.name || "Shambu General Hospital";

      totalAvailable += units;
      totalsPerGroup[bg] = (totalsPerGroup[bg] || 0) + units;

      const dateForWeekCheck = row.created_at || row.updated_at;
      if (dateForWeekCheck && dateForWeekCheck >= weekAgoISO) {
        addedThisWeek += units;
      }

      const { expiryFormatted, isExpiringSoon } = getExpiryInfo(row.expiry_date, row.updated_at || row.created_at, comp);
      if (isExpiringSoon) {
        expiringIn7Days += units;
      }

      // Calculate reserved units for display
      const rowReserved = row.units_reserved ?? (reservedPerGroup[bg] ? Math.min(units, reservedPerGroup[bg]) : 0);

      let status: "Adequate" | "Moderate" | "Low" | "Critical Shortage" = "Adequate";
      if (units < 10) status = "Critical Shortage";
      else if (units <= 19) status = "Low";
      else if (units <= 39) status = "Moderate";

      return {
        id: row.id,
        bloodGroup: bg,
        component: formatComponentType(comp),
        rawComponent: comp,
        unitsAvailable: units,
        unitsReserved: rowReserved,
        expiry: expiryFormatted,
        status,
        hospital: hospitalName,
        hospitalId: row.hospital_id || "",
      };
    });

    // Determine critical shortages across all 8 blood groups
    const criticalGroups: string[] = [];
    ALL_BLOOD_GROUPS.forEach((bg) => {
      const groupTotal = totalsPerGroup[bg] || 0;
      if (groupTotal < 10) {
        criticalGroups.push(bg);
      }
    });

    const criticalShortagesCount = criticalGroups.length;
    const criticalGroupsText =
      criticalGroups.length > 0
        ? `${criticalGroups.join(" and ")} below threshold`
        : "All blood groups above threshold";

    return {
      stats: {
        totalAvailable,
        addedThisWeek,
        reservedForPatients: totalReserved,
        criticalShortagesCount,
        criticalGroupsText,
        expiringIn7Days,
      },
      items,
    };
  } catch (error) {
    console.error("Error fetching admin inventory data from Supabase:", error);
    return {
      stats: {
        totalAvailable: 0,
        addedThisWeek: 0,
        reservedForPatients: 0,
        criticalShortagesCount: 0,
        criticalGroupsText: "No shortage data available",
        expiringIn7Days: 0,
      },
      items: [],
    };
  }
}

/**
 * Inserts or updates an inventory batch in Supabase using createAdminClient.
 */
export async function addInventoryBatch(input: {
  hospitalId: string;
  bloodGroup: BloodGroup;
  componentType: ComponentType;
  unitsAvailable: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    if (!input.hospitalId || !input.bloodGroup || !input.componentType || input.unitsAvailable < 0) {
      return { success: false, error: "Please enter valid inventory details." };
    }

    const { data: existing } = await supabase
      .from("blood_inventory")
      .select("id, units_available")
      .eq("hospital_id", input.hospitalId)
      .eq("blood_group", input.bloodGroup)
      .eq("component_type", input.componentType)
      .maybeSingle();

    if (existing?.id) {
      const newStock = (existing.units_available || 0) + input.unitsAvailable;
      const { error: updateErr } = await supabase
        .from("blood_inventory")
        .update({
          units_available: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateErr) {
        console.error("Error updating inventory stock:", updateErr);
        return { success: false, error: "Failed to update inventory stock." };
      }
    } else {
      // Calculate expiry_date for new batch
      const now = new Date();
      let shelfDays = 35;
      if (input.componentType === "platelets") shelfDays = 7;
      else if (input.componentType === "plasma" || input.componentType === "cryoprecipitate") shelfDays = 365;

      const defaultExpiry = new Date(now.getTime() + shelfDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const { error: insertErr } = await supabase
        .from("blood_inventory")
        .insert({
          hospital_id: input.hospitalId,
          blood_group: input.bloodGroup,
          component_type: input.componentType,
          units_available: input.unitsAvailable,
          units_reserved: 0,
          expiry_date: defaultExpiry,
          updated_at: new Date().toISOString(),
        });

      if (insertErr) {
        console.error("Error inserting inventory batch:", insertErr);
        return { success: false, error: "Failed to add inventory batch." };
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in addInventoryBatch:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Fetches available hospitals for the Add Inventory Batch modal.
 */
export async function getInventoryHospitalOptions(): Promise<Array<{ id: string; name: string }>> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;
    const { data } = await supabase.from("hospitals").select("id, name");
    return (data || []).map((h: any) => ({ id: h.id, name: h.name }));
  } catch {
    return [];
  }
}
