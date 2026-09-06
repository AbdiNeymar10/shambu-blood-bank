import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely parses date string (e.g., "2026-09-08") and time string (e.g., "09:00 AM", "02:30 PM", "14:30")
 * into a valid JavaScript Date object without throwing RangeError: Invalid time value.
 */
export function parseDateTime(dateStr: string, timeStr?: string): Date {
  if (!dateStr) {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1);
    defaultDate.setHours(9, 0, 0, 0);
    return defaultDate;
  }

  const cleanDateStr = dateStr.split("T")[0];
  const partsDate = cleanDateStr.split("-");

  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  let day = new Date().getDate() + 1;

  if (partsDate.length === 3) {
    const y = parseInt(partsDate[0], 10);
    const m = parseInt(partsDate[1], 10) - 1;
    const d = parseInt(partsDate[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      year = y;
      month = m;
      day = d;
    }
  }

  let hours = 9;
  let minutes = 0;

  if (timeStr && timeStr.trim()) {
    const rawTime = timeStr.trim().toUpperCase();
    const isPM = rawTime.includes("PM");
    const isAM = rawTime.includes("AM");

    const cleanTime = rawTime.replace(/AM|PM/g, "").trim();
    const timeParts = cleanTime.split(":");

    if (timeParts.length >= 1) {
      const h = parseInt(timeParts[0], 10);
      if (!isNaN(h)) {
        hours = h;
      }
    }
    if (timeParts.length >= 2) {
      const m = parseInt(timeParts[1], 10);
      if (!isNaN(m)) {
        minutes = m;
      }
    }

    if (isPM && hours < 12) {
      hours += 12;
    } else if (isAM && hours === 12) {
      hours = 0;
    }
  }

  const dateObj = new Date(year, month, day, hours, minutes, 0, 0);

  if (isNaN(dateObj.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 1);
    fallback.setHours(9, 0, 0, 0);
    return fallback;
  }

  return dateObj;
}
