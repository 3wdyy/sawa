"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { fetchPrayerTimes, getCurrentPrayer, getNextPrayer, type PrayerTimes } from "../api/aladhan";
import { getCurrentTimeInTimezone, getTodayInTimezone } from "@/lib/utils/date";
import { STORAGE_KEYS, PRAYER_NAMES } from "@/lib/constants";
import type { PrayerName } from "@/types/database";

interface UsePrayerTimesOptions {
  city: string;
  country: string;
  timezone: string;
}

interface UsePrayerTimesReturn {
  prayerTimes: PrayerTimes | null;
  currentPrayer: PrayerName | null;
  nextPrayer: { name: PrayerName; time: string } | null;
  currentTime: string;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch and manage prayer times for a user's location
 * Caches in localStorage and refreshes daily
 */
export function usePrayerTimes({
  city,
  country,
  timezone,
}: UsePrayerTimesOptions): UsePrayerTimesReturn {
  const [currentTime, setCurrentTime] = useState(() =>
    getCurrentTimeInTimezone(timezone)
  );

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeInTimezone(timezone));
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [timezone]);

  // Cache key includes date so it refreshes daily
  const today = getTodayInTimezone(timezone);
  const cacheKey = `${STORAGE_KEYS.PRAYER_TIMES_CACHE}_${city}_${today}`;

  // Fetch prayer times with caching
  const {
    data: prayerTimes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prayerTimes", city, country, today],
    queryFn: async () => {
      // Check localStorage cache first
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            return JSON.parse(cached) as PrayerTimes;
          } catch {
            // Invalid cache, fetch fresh
          }
        }
      }

      const times = await fetchPrayerTimes(city, country);

      // Cache in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(cacheKey, JSON.stringify(times));
      }

      return times;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  // Compute current and next prayer
  const currentPrayer = prayerTimes
    ? getCurrentPrayer(prayerTimes, currentTime)
    : null;

  const nextPrayer = prayerTimes
    ? getNextPrayer(prayerTimes, currentTime)
    : null;

  return {
    prayerTimes: prayerTimes ?? null,
    currentPrayer,
    nextPrayer,
    currentTime,
    isLoading,
    error: error as Error | null,
  };
}

/**
 * Get all prayer times as an array for iteration
 */
export function usePrayerTimesArray(prayerTimes: PrayerTimes | null) {
  if (!prayerTimes) return [];

  return PRAYER_NAMES.map((name) => ({
    name,
    time: prayerTimes[name],
  }));
}
