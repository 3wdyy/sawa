/**
 * Date utilities for Sawa
 * Handles timezone conversions and formatting
 */

/**
 * Get today's date in a specific timezone as YYYY-MM-DD string
 */
export function getTodayInTimezone(timezone: string): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

/**
 * Get current time in a specific timezone as HH:MM string (24h format)
 */
export function getCurrentTimeInTimezone(timezone: string): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatter.format(now);
}

/**
 * Format a date for display
 */
export function formatDateForDisplay(
  date: Date | string,
  timezone: string
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return formatter.format(d);
}

/**
 * Parse a time string (HH:MM) to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if current time is between two times (handles midnight crossing)
 */
export function isTimeBetween(
  current: string,
  start: string,
  end: string
): boolean {
  const currentMins = timeToMinutes(current);
  const startMins = timeToMinutes(start);
  const endMins = timeToMinutes(end);

  if (endMins < startMins) {
    // Crosses midnight (e.g., Isha to Fajr)
    return currentMins >= startMins || currentMins < endMins;
  }
  return currentMins >= startMins && currentMins < endMins;
}
