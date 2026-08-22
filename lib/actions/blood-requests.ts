"use server";

import { createClient } from "@/lib/supabase/server";
import type { BloodGroup, RequestPriority, RequestStatus } from "@/types/database.types";

export type BloodRequestItem = {
  id: string;
  requestNumber: string;
  patientName: string;
  patientAge?: number | null;
  hospital: string;
  hospitalAddress?: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  unitsFulfilled: number;
  priority: string;
  status: string;
  requiredBy: string;
  contact: string;
  medicalReason?: string;
  createdAt?: string;
};

export type AdminBloodRequestsData = {
  stats: {
    totalRequests: number;
    pendingAction: number;
    approvedInTransit: number;
    fulfilledToday: number;
  };
  requests: BloodRequestItem[];
};

/**
 * Fetches summary statistics and all blood requests for the Admin Blood Requests Management page.
 */
export async function getAdminBloodRequestsData(): Promise<AdminBloodRequestsData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalRes,
      pendingRes,
      approvedRes,
      fulfilledTodayRes,
      requestsRes,
    ] = await Promise.all([
      // 1. Total Requests count
      supabase.from("blood_requests").select("*", { count: "exact", head: true }),

      // 2. Pending Action count
      supabase.from("blood_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),

      // 3. Approved / In Transit count
      supabase.from("blood_requests").select("*", { count: "exact", head: true }).eq("status", "approved"),

      // 4. Fulfilled Today count
      supabase
        .from("blood_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "fulfilled")
        .gte("updated_at", todayStart.toISOString())
        .lte("updated_at", todayEnd.toISOString()),

      // 5. Request list
      supabase
        .from("blood_requests")
        .select("id, request_number, patient_name, patient_age, blood_group, units_needed, units_fulfilled, priority, status, required_by_date, contact_phone, medical_reason, created_at, hospitals(name, address)")
        .order("created_at", { ascending: false }),
    ]);

    const totalRequests = totalRes.count ?? 0;
    const pendingAction = pendingRes.count ?? 0;
    const approvedInTransit = approvedRes.count ?? 0;
    const fulfilledToday = fulfilledTodayRes.count ?? 0;

    const rows = requestsRes.data || [];
    const requests: BloodRequestItem[] = rows.map((row: any) => {
      const hospitalObj = Array.isArray(row.hospitals) ? row.hospitals[0] : row.hospitals;

      const dateObj = row.required_by_date ? new Date(row.required_by_date) : null;
      const formattedRequiredBy = dateObj
        ? dateObj.toISOString().split("T")[0]
        : "N/A";

      const rawPriority = (row.priority || "normal").toString();
      const priorityFormatted =
        rawPriority.charAt(0).toUpperCase() + rawPriority.slice(1).toLowerCase();

      const rawStatus = (row.status || "pending").toString();
      const statusFormatted =
        rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

      return {
        id: row.id,
        requestNumber: row.request_number || `REQ-${row.id.substring(0, 8)}`,
        patientName: row.patient_name || "Unknown Patient",
        patientAge: row.patient_age,
        hospital: hospitalObj?.name || "Shambu General Hospital",
        hospitalAddress: hospitalObj?.address || "",
        bloodGroup: row.blood_group || "O+",
        unitsNeeded: row.units_needed || 1,
        unitsFulfilled: row.units_fulfilled || 0,
        priority: priorityFormatted,
        status: statusFormatted,
        requiredBy: formattedRequiredBy,
        contact: row.contact_phone || "N/A",
        medicalReason: row.medical_reason || "",
        createdAt: row.created_at || "",
      };
    });

    return {
      stats: {
        totalRequests,
        pendingAction,
        approvedInTransit,
        fulfilledToday,
      },
      requests,
    };
  } catch (error) {
    console.error("Error fetching admin blood requests data from Supabase:", error);
    return {
      stats: {
        totalRequests: 0,
        pendingAction: 0,
        approvedInTransit: 0,
        fulfilledToday: 0,
      },
      requests: [],
    };
  }
}

/**
 * Updates a blood request status (e.g. Approve, Reject).
 */
export async function updateBloodRequestStatus(
  requestId: string,
  newStatus: RequestStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from("blood_requests")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating status:", error);
      return { success: false, error: "Failed to update status." };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in updateBloodRequestStatus:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Fetches available inventory stock for a blood group.
 */
export async function getInventoryStockForBloodGroup(bloodGroup: BloodGroup): Promise<number> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;
    const { data } = await supabase
      .from("blood_inventory")
      .select("units_available")
      .eq("blood_group", bloodGroup);

    if (!data || data.length === 0) return 0;
    return data.reduce((acc: number, item: any) => acc + (item.units_available || 0), 0);
  } catch {
    return 0;
  }
}

/**
 * Safely allocates blood units from blood_inventory to a blood_request.
 */
export async function allocateBloodUnits(
  requestId: string,
  unitsToAllocate: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    // 1. Fetch current request details
    const { data: request, error: reqErr } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (reqErr || !request) {
      return { success: false, error: "Blood request not found." };
    }

    const unitsNeeded = request.units_needed || 0;
    const unitsFulfilled = request.units_fulfilled || 0;
    const remainingNeeded = unitsNeeded - unitsFulfilled;

    if (remainingNeeded <= 0) {
      return { success: false, error: "This request has already been fully fulfilled." };
    }

    if (unitsToAllocate <= 0 || unitsToAllocate > remainingNeeded) {
      return { success: false, error: `You can allocate up to ${remainingNeeded} unit(s).` };
    }

    // 2. Check available inventory for this blood_group
    const { data: inventory, error: invErr } = await supabase
      .from("blood_inventory")
      .select("*")
      .eq("blood_group", request.blood_group)
      .limit(1);

    if (invErr || !inventory || inventory.length === 0) {
      return { success: false, error: `No blood inventory record found for ${request.blood_group}.` };
    }

    const invRecord = inventory[0];
    const availableStock = invRecord.units_available || 0;

    if (availableStock < unitsToAllocate) {
      return { success: false, error: `Insufficient stock. Only ${availableStock} unit(s) available for ${request.blood_group}.` };
    }

    // 3. Deduct stock from blood_inventory
    const newStock = availableStock - unitsToAllocate;
    const { error: updateInvErr } = await supabase
      .from("blood_inventory")
      .update({ units_available: newStock, last_updated: new Date().toISOString() })
      .eq("id", invRecord.id);

    if (updateInvErr) {
      console.error("Error updating inventory:", updateInvErr);
      return { success: false, error: "Failed to update blood inventory." };
    }

    // 4. Update units_fulfilled and status on blood_requests
    const newFulfilled = unitsFulfilled + unitsToAllocate;
    const newStatus: RequestStatus = newFulfilled >= unitsNeeded ? "fulfilled" : "approved";

    const { error: updateReqErr } = await supabase
      .from("blood_requests")
      .update({
        units_fulfilled: newFulfilled,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateReqErr) {
      console.error("Error updating request:", updateReqErr);
      return { success: false, error: "Failed to update blood request." };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in allocateBloodUnits:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
