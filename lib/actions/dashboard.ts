"use server";

import { createClient } from "@/lib/supabase/server";
import type { BloodGroup } from "@/types/database.types";

export type DashboardData = {
  stats: {
    totalDonors: number;
    pendingRequests: number;
    availableBloodUnits: number;
    activeCampaigns: number;
  };
  bloodStockData: Array<{
    group: BloodGroup;
    units: number;
  }>;
  recentRequests: Array<{
    id: string;
    patientName: string;
    bloodGroup: string;
    units: number;
    hospital: string;
    priority: string;
    status: string;
    date: string;
  }>;
  emergencyAlerts: Array<{
    id: string;
    type: string;
    bloodGroup: string;
    message: string;
    timestamp: string;
  }>;
  donationTrends: Array<{
    month: string;
    donations: number;
  }>;
  monthlyGrowth: string;
};

const ALL_BLOOD_GROUPS: BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Fetches all metrics required for the Admin Dashboard from Supabase in a single parallel batch.
 */
export async function getAdminDashboardData(): Promise<DashboardData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    // Run all 6 queries concurrently for minimal latency
    const [
      totalDonorsRes,
      pendingRequestsRes,
      inventoryRes,
      activeCampaignsRes,
      recentRequestsRes,
      donationsRes,
    ] = await Promise.all([
      // 1. Total registered donors count
      supabase
        .from("donor_profiles")
        .select("*", { count: "exact", head: true }),

      // 2. Pending blood requests count
      supabase
        .from("blood_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),

      // 3. Inventory for total units & blood group breakdown
      supabase
        .from("blood_inventory")
        .select("blood_group, units_available"),

      // 4. Active campaigns count
      supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),

      // 5. Recent 4 blood requests with hospital names
      supabase
        .from("blood_requests")
        .select("id, request_number, patient_name, blood_group, units_needed, priority, status, created_at, hospitals(name)")
        .order("created_at", { ascending: false })
        .limit(4),

      // 6. Completed blood donations for monthly trends & growth
      supabase
        .from("blood_donations")
        .select("donation_date, units_donated")
        .eq("status", "completed")
        .order("donation_date", { ascending: true }),
    ]);

    // 1. Donors
    const totalDonors = totalDonorsRes.count ?? 0;

    // 2. Pending requests
    const pendingRequests = pendingRequestsRes.count ?? 0;

    // 3. Inventory aggregation
    const inventoryRows = inventoryRes.data || [];
    let availableBloodUnits = 0;
    const groupUnitsMap: Record<string, number> = {};

    ALL_BLOOD_GROUPS.forEach((g) => {
      groupUnitsMap[g] = 0;
    });

    for (const row of inventoryRows) {
      const units = Number(row.units_available) || 0;
      availableBloodUnits += units;
      if (row.blood_group && groupUnitsMap[row.blood_group] !== undefined) {
        groupUnitsMap[row.blood_group] += units;
      }
    }

    const bloodStockData = ALL_BLOOD_GROUPS.map((group) => ({
      group,
      units: groupUnitsMap[group] || 0,
    }));

    // 4. Active campaigns
    const activeCampaigns = activeCampaignsRes.count ?? 0;

    // 5. Recent requests mapping
    const recentRequestsRows = recentRequestsRes.data || [];
    const recentRequests = recentRequestsRows.map((req: any) => {
      let hospitalName = "Unknown Hospital";
      if (req.hospitals) {
        if (Array.isArray(req.hospitals) && req.hospitals.length > 0) {
          hospitalName = req.hospitals[0]?.name || hospitalName;
        } else if (typeof req.hospitals === "object" && req.hospitals.name) {
          hospitalName = req.hospitals.name;
        }
      }

      const rawPriority = (req.priority || "normal").toString();
      const priorityFormatted =
        rawPriority.charAt(0).toUpperCase() + rawPriority.slice(1).toLowerCase();

      const rawStatus = (req.status || "pending").toString();
      const statusFormatted =
        rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

      return {
        id: req.id || req.request_number || `REQ-${Math.random().toString().slice(2, 6)}`,
        patientName: req.patient_name || "N/A",
        bloodGroup: req.blood_group || "N/A",
        units: req.units_needed || 0,
        hospital: hospitalName,
        priority: priorityFormatted,
        status: statusFormatted,
        date: req.created_at
          ? new Date(req.created_at).toISOString().split("T")[0]
          : "",
      };
    });

    // 6. Emergency shortage alerts generation
    const emergencyAlerts: Array<{
      id: string;
      type: string;
      bloodGroup: string;
      message: string;
      timestamp: string;
    }> = [];

    bloodStockData.forEach((stock, idx) => {
      if (stock.units < 10) {
        emergencyAlerts.push({
          id: `ALERT-CRIT-${idx}`,
          type: "Critical Shortage",
          bloodGroup: stock.group,
          message: `${stock.group} blood stock is critically low (${stock.units} units available). Immediate outreach required.`,
          timestamp: "Live update",
        });
      } else if (stock.units < 25) {
        emergencyAlerts.push({
          id: `ALERT-WARN-${idx}`,
          type: "High Demand",
          bloodGroup: stock.group,
          message: `High demand for ${stock.group} blood (${stock.units} units available).`,
          timestamp: "Live update",
        });
      }
    });

    // 7. Monthly donation trends & growth
    const donations = donationsRes.data || [];
    const monthCountsMap: Map<string, { label: string; yearMonth: string; count: number }> = new Map();

    if (donations.length > 0) {
      donations.forEach((d: any) => {
        if (!d.donation_date) return;
        const dateObj = new Date(d.donation_date);
        if (isNaN(dateObj.getTime())) return;

        const yearMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
        const label = MONTH_NAMES[dateObj.getMonth()];

        if (!monthCountsMap.has(yearMonth)) {
          monthCountsMap.set(yearMonth, { label, yearMonth, count: 0 });
        }
        monthCountsMap.get(yearMonth)!.count += 1;
      });
    }

    let donationTrends: Array<{ month: string; donations: number }> = [];
    let monthlyGrowth = "0%";

    if (monthCountsMap.size > 0) {
      const sortedMonths = Array.from(monthCountsMap.values()).sort((a, b) =>
        a.yearMonth.localeCompare(b.yearMonth)
      );

      donationTrends = sortedMonths.map((m) => ({
        month: m.label,
        donations: m.count,
      }));

      if (sortedMonths.length >= 2) {
        const currentMonth = sortedMonths[sortedMonths.length - 1].count;
        const prevMonth = sortedMonths[sortedMonths.length - 2].count;

        if (prevMonth > 0) {
          const growth = ((currentMonth - prevMonth) / prevMonth) * 100;
          monthlyGrowth = `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
        } else if (currentMonth > 0) {
          monthlyGrowth = "+100%";
        } else {
          monthlyGrowth = "0%";
        }
      } else {
        monthlyGrowth = "0%";
      }
    } else {
      // Safe fallback if no completed donations in DB yet
      const now = new Date();
      const currentMonthIdx = now.getMonth();
      const fallbackMonths = [];

      for (let i = 5; i >= 0; i--) {
        const mIdx = (currentMonthIdx - i + 12) % 12;
        fallbackMonths.push({ month: MONTH_NAMES[mIdx], donations: 0 });
      }
      donationTrends = fallbackMonths;
      monthlyGrowth = "0%";
    }

    return {
      stats: {
        totalDonors,
        pendingRequests,
        availableBloodUnits,
        activeCampaigns,
      },
      bloodStockData,
      recentRequests,
      emergencyAlerts,
      donationTrends,
      monthlyGrowth,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data from Supabase:", error);
    return {
      stats: {
        totalDonors: 0,
        pendingRequests: 0,
        availableBloodUnits: 0,
        activeCampaigns: 0,
      },
      bloodStockData: ALL_BLOOD_GROUPS.map((g) => ({ group: g, units: 0 })),
      recentRequests: [],
      emergencyAlerts: [],
      donationTrends: MONTH_NAMES.slice(0, 6).map((m) => ({ month: m, donations: 0 })),
      monthlyGrowth: "0%",
    };
  }
}

export type HomeImpactStatsData = {
  registeredDonors: number;
  bloodUnitsCollected: number;
  requestsFulfilled: number;
  livesSaved: number;
};

/**
 * Fetches real impact statistics from Supabase for the Home Page ImpactStats component.
 */
export async function getPublicHomeImpactStats(): Promise<HomeImpactStatsData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createClient()) as any;

    const [donorsRes, donationsRes, requestsRes] = await Promise.all([
      // 1. Total registered donors count
      supabase
        .from("donor_profiles")
        .select("*", { count: "exact", head: true }),

      // 2. Completed blood donations
      supabase
        .from("blood_donations")
        .select("units_donated")
        .eq("status", "completed"),

      // 3. Emergency / fulfilled blood requests count
      supabase
        .from("blood_requests")
        .select("*", { count: "exact", head: true })
        .in("status", ["fulfilled", "approved"]),
    ]);

    const registeredDonors = donorsRes.count ?? 0;
    const requestsFulfilled = requestsRes.count ?? 0;

    const donationRows = donationsRes.data || [];
    let bloodUnitsCollected = 0;
    donationRows.forEach((row: any) => {
      bloodUnitsCollected += Number(row.units_donated) || 1;
    });

    const livesSaved = bloodUnitsCollected * 3;

    return {
      registeredDonors,
      bloodUnitsCollected,
      requestsFulfilled,
      livesSaved,
    };
  } catch (error) {
    console.error("Error fetching public home impact stats from Supabase:", error);
    return {
      registeredDonors: 0,
      bloodUnitsCollected: 0,
      requestsFulfilled: 0,
      livesSaved: 0,
    };
  }
}
