/**
 * Aladhan Prayer Times API Integration
 * https://aladhan.com/prayer-times-api
 */

import {
  ALADHAN_API_URL,
  PRAYER_CALCULATION_METHODS,
  PRAYER_NAMES,
} from "@/lib/constants";
import type { PrayerName } from "@/types/database";

export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: AladhanTimings;
    date: {
      readable: string;
      gregorian: {
        date: string;
      };
    };
  };
}

/**
 * Get calculation method based on country code
 */
function getCalculationMethod(country: string): number {
  switch (country.toUpperCase()) {
    case "EG":
      return PRAYER_CALCULATION_METHODS.EGYPT;
    case "AE":
    case "SA":
      return PRAYER_CALCULATION_METHODS.UAE;
    default:
      return PRAYER_CALCULATION_METHODS.EGYPT;
  }
}

/**
 * Fetch prayer times for a city/country on a specific date
 */
export async function fetchPrayerTimes(
  city: string,
  country: string,
  date?: Date
): Promise<PrayerTimes> {
  const targetDate = date || new Date();
  const day = targetDate.getDate();
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();
  const method = getCalculationMethod(country);

  const url = `${ALADHAN_API_URL}/timingsByCity/${day}-${month}-${year}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
  }

  const data: AladhanResponse = await response.json();

  if (data.code !== 200) {
    throw new Error(`Aladhan API error: ${data.status}`);
  }

  const timings = data.data.timings;

  return {
    fajr: formatTime(timings.Fajr),
    dhuhr: formatTime(timings.Dhuhr),
    asr: formatTime(timings.Asr),
    maghrib: formatTime(timings.Maghrib),
    isha: formatTime(timings.Isha),
  };
}

/**
 * Format time from Aladhan (HH:MM (TZ)) to HH:MM
 */
function formatTime(time: string): string {
  // Aladhan returns times like "05:23 (GST)"
  return time.split(" ")[0];
}

/**
 * Determine which prayer is currently active based on times and current time
 */
export function getCurrentPrayer(
  prayerTimes: PrayerTimes,
  currentTime: string
): PrayerName | null {
  const current = timeToMinutes(currentTime);

  const times = PRAYER_NAMES.map((name) => ({
    name,
    minutes: timeToMinutes(prayerTimes[name]),
  }));

  // Find the current prayer window
  // A prayer is "current" from its time until the next prayer time
  for (let i = times.length - 1; i >= 0; i--) {
    if (current >= times[i].minutes) {
      return times[i].name;
    }
  }

  // If before Fajr, we're still in Isha from previous day
  return "isha";
}

/**
 * Get the next prayer after the current one
 */
export function getNextPrayer(
  prayerTimes: PrayerTimes,
  currentTime: string
): { name: PrayerName; time: string } {
  const current = timeToMinutes(currentTime);

  for (const name of PRAYER_NAMES) {
    const prayerMinutes = timeToMinutes(prayerTimes[name]);
    if (prayerMinutes > current) {
      return { name, time: prayerTimes[name] };
    }
  }

  // After Isha, next prayer is Fajr (tomorrow)
  return { name: "fajr", time: prayerTimes.fajr };
}

/**
 * Convert HH:MM to minutes since midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if a prayer is completed (logged) for today
 * Note: This is a UI helper, actual logic is in the habits feature
 */
export function isPrayerCompleted(
  prayerName: PrayerName,
  completedPrayers: PrayerName[]
): boolean {
  return completedPrayers.includes(prayerName);
}
