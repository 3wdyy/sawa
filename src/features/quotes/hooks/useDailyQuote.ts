"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/features/auth/context";
import { getSawaDay } from "@/lib/utils/date";
import { getTodaysQuote } from "../api/quotes";

/**
 * Hook for daily quote - one Islamic/relationship quote per day
 */
export function useDailyQuote() {
  const { user } = useAuth();

  // Use Fajr-based day (day resets at Fajr, not midnight)
  const today = useMemo(() => {
    return user ? getSawaDay(user.timezone) : new Date().toISOString().split("T")[0];
  }, [user]);

  const { data: quote, isLoading } = useQuery({
    queryKey: ["daily-quote", today],
    queryFn: () => getTodaysQuote(today),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  return {
    quote,
    isLoading,
    today,
  };
}
