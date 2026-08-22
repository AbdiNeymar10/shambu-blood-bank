"use server";

import { createAdminClient } from "@/lib/supabase/server";
import type { BloodGroup } from "@/types/database.types";

export type MonthlyFulfillmentItem = {
  month: string;
  requested: number;
  fulfilled: number;
};

export type BloodDistributionItem = {
  name: BloodGroup;
  value: number;
};

export type AdminReportsData = {
  fulfillmentRate: string;
  fulfillmentSubtext: string;
  totalDonatedYTD: string;
  totalDonatedSubtext: string;
  newDonorsYTD: string;
  donorGrowthText: string;
  monthlyFulfillment: MonthlyFulfillmentItem[];
  bloodDistribution: BloodDistributionItem[];
};

const ALL_BLOOD_GROUPS: BloodGroup[] = ["O+", "A+", "B+", "O-", "A-", "AB+", "B-", "AB-"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Server action to fetch real analytics & reports metrics from Supabase
 */
export async function getAdminReportsData(): Promise<AdminReportsData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;
    const now = new Date();
    const currentYear = now.getFullYear();

    const startOfCurrentYear = new Date(currentYear, 0, 1).toISOString();
    const startOfPrevYear = new Date(currentYear - 1, 0, 1).toISOString();
    
    // Equivalent day/month in previous year
    const sameDayPrevYear = new Date(currentYear - 1, now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

    // 1. Fetch Blood Requests for Fulfillment Rate & Monthly Chart
    const { data: requests } = await supabase
      .from("blood_requests")
      .select("id, units_needed, units_fulfilled, status, created_at");

    let totalRequestedUnits = 0;
    let totalFulfilledUnits = 0;

    // Monthly bucket structure for current year YTD (Jan through current month, or all 12)
    const currentMonthIndex = now.getMonth();
    const monthlyMap: Record<number, { requested: number; fulfilled: number }> = {};
    
    for (let m = 0; m <= Math.min(currentMonthIndex, 11); m++) {
      monthlyMap[m] = { requested: 0, fulfilled: 0 };
    }

    if (requests && requests.length > 0) {
      requests.forEach((r: { units_needed?: number; units_fulfilled?: number; created_at?: string }) => {
        const needed = Number(r.units_needed || 0);
        const fulfilled = Number(r.units_fulfilled || 0);

        totalRequestedUnits += needed;
        totalFulfilledUnits += fulfilled;

        if (r.created_at) {
          const reqDate = new Date(r.created_at);
          if (reqDate.getFullYear() === currentYear) {
            const mIdx = reqDate.getMonth();
            if (monthlyMap[mIdx]) {
              monthlyMap[mIdx].requested += needed;
              monthlyMap[mIdx].fulfilled += fulfilled;
            }
          }
        }
      });
    }

    // Calculate overall Fulfillment Rate
    let calcRate = 0;
    if (totalRequestedUnits > 0) {
      calcRate = Math.min(100, (totalFulfilledUnits / totalRequestedUnits) * 100);
    }
    const fulfillmentRate = totalRequestedUnits > 0 ? `${calcRate.toFixed(1)}%` : "0.0%";

    let fulfillmentSubtext = "High operational reliability";
    if (totalRequestedUnits === 0) {
      fulfillmentSubtext = "No blood request data yet";
    } else if (calcRate < 70) {
      fulfillmentSubtext = "Needs supply optimization";
    } else if (calcRate < 90) {
      fulfillmentSubtext = "Moderate operational fulfillment";
    }

    const monthlyFulfillment: MonthlyFulfillmentItem[] = Object.keys(monthlyMap)
      .map(Number)
      .sort((a, b) => a - b)
      .map((mIdx) => ({
        month: MONTH_NAMES[mIdx],
        requested: monthlyMap[mIdx].requested,
        fulfilled: monthlyMap[mIdx].fulfilled,
      }));

    // 2. Fetch Blood Donations for Total Donated YTD
    const { data: donations } = await supabase
      .from("blood_donations")
      .select("units_donated, status, donation_date, created_at")
      .eq("status", "completed");

    let ytdUnitsDonated = 0;

    if (donations && donations.length > 0) {
      donations.forEach((d: { units_donated?: number; donation_date?: string; created_at?: string }) => {
        const dDateStr = d.donation_date || d.created_at;
        if (dDateStr) {
          const dDate = new Date(dDateStr);
          if (dDate.getFullYear() === currentYear && dDate <= now) {
            const units = Number(d.units_donated || 1);
            ytdUnitsDonated += units;
          }
        }
      });
    }

    const totalDonatedYTD = `${ytdUnitsDonated.toLocaleString()} Units`;
    const totalDonatedSubtext = "Across Shambu & regional drives";

    // 3. Fetch Donor Profiles for New Donors YTD & YoY Growth & Blood Group Share
    const { data: profiles } = await supabase
      .from("donor_profiles")
      .select("id, blood_group, created_at");

    let currentYtdDonors = 0;
    let prevYtdDonors = 0;
    const bloodGroupCounts: Record<string, number> = {};
    ALL_BLOOD_GROUPS.forEach((bg) => (bloodGroupCounts[bg] = 0));

    let totalValidDonors = 0;

    if (profiles && profiles.length > 0) {
      profiles.forEach((p: { blood_group?: string; created_at?: string }) => {
        if (p.created_at) {
          const cDate = new Date(p.created_at);
          const cIso = cDate.toISOString();

          if (cIso >= startOfCurrentYear) {
            currentYtdDonors++;
          }
          if (cIso >= startOfPrevYear && cIso <= sameDayPrevYear) {
            prevYtdDonors++;
          }
        }

        if (p.blood_group && ALL_BLOOD_GROUPS.includes(p.blood_group as BloodGroup)) {
          bloodGroupCounts[p.blood_group] = (bloodGroupCounts[p.blood_group] || 0) + 1;
          totalValidDonors++;
        }
      });
    }

    const newDonorsYTD = `${currentYtdDonors.toLocaleString()} Donors`;

    let donorGrowthText = "New this year";
    if (prevYtdDonors > 0) {
      const growthPct = Math.round(((currentYtdDonors - prevYtdDonors) / prevYtdDonors) * 100);
      donorGrowthText = `${growthPct >= 0 ? "+" : ""}${growthPct}% growth vs last year`;
    } else if (currentYtdDonors === 0) {
      donorGrowthText = "No donor registrations YTD";
    }

    // Build Blood Group Distribution dataset
    const bloodDistribution: BloodDistributionItem[] = ALL_BLOOD_GROUPS.map((bg) => {
      const count = bloodGroupCounts[bg] || 0;
      const share = totalValidDonors > 0 ? Math.round((count / totalValidDonors) * 100) : 0;
      return {
        name: bg,
        value: share,
      };
    }).filter((item) => item.value > 0 || totalValidDonors === 0);

    // Ensure chart has data items if totalValidDonors is 0
    if (bloodDistribution.length === 0) {
      ALL_BLOOD_GROUPS.slice(0, 4).forEach((bg) => {
        bloodDistribution.push({ name: bg, value: 0 });
      });
    }

    return {
      fulfillmentRate,
      fulfillmentSubtext,
      totalDonatedYTD,
      totalDonatedSubtext,
      newDonorsYTD,
      donorGrowthText,
      monthlyFulfillment,
      bloodDistribution,
    };
  } catch (err) {
    console.error("Error fetching admin reports data:", err);
    return {
      fulfillmentRate: "0.0%",
      fulfillmentSubtext: "Error loading report metrics",
      totalDonatedYTD: "0 Units",
      totalDonatedSubtext: "Across Shambu & regional drives",
      newDonorsYTD: "0 Donors",
      donorGrowthText: "No data available",
      monthlyFulfillment: [
        { month: "Jan", requested: 0, fulfilled: 0 },
        { month: "Feb", requested: 0, fulfilled: 0 },
      ],
      bloodDistribution: [
        { name: "O+", value: 0 },
        { name: "A+", value: 0 },
      ],
    };
  }
}
