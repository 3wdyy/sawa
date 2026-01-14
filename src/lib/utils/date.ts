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

/**
 * Default Fajr times by timezone (approximate, used when actual Fajr time not available)
 * These are conservative estimates for winter months
 */
const DEFAULT_FAJR_TIMES: Record<string, string> = {
  "Asia/Dubai": "05:30",    // Dubai
  "Africa/Cairo": "05:00",  // Cairo
  "default": "05:00",       // Fallback
};

/**
 * Get the "Sawa day" - the Islamic day starts at Fajr, not midnight
 * Before Fajr = yesterday's day
 * After Fajr = today's day
 *
 * @param timezone - User's timezone
 * @param fajrTime - Optional actual Fajr time (HH:MM format), defaults to timezone-specific estimate
 */
export function getSawaDay(timezone: string, fajrTime?: string): string {
  const now = new Date();
  const currentTime = getCurrentTimeInTimezone(timezone);
  const fajr = fajrTime || DEFAULT_FAJR_TIMES[timezone] || DEFAULT_FAJR_TIMES["default"];

  const currentMinutes = timeToMinutes(currentTime);
  const fajrMinutes = timeToMinutes(fajr);

  // If before Fajr, we're still on "yesterday's" Islamic day
  if (currentMinutes < fajrMinutes) {
    // Subtract one day
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(yesterday);
  }

  // After Fajr, use today's date
  return getTodayInTimezone(timezone);
}

/**
 * Get the "Sawa day" using simple date - for use in hooks without prayer times
 * Uses a fixed time approach (5:00 AM) as the day boundary
 */
export function getSawaDaySimple(): string {
  const now = new Date();
  const hours = now.getHours();

  // Before 5 AM = still yesterday
  if (hours < 5) {
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return yesterday.toISOString().split("T")[0];
  }

  return now.toISOString().split("T")[0];
}
