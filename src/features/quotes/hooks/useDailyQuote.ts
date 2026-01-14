"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getTodaysQuote } from "../api/quotes";

/**
 * Hook for daily quote - one Islamic/relationship quote per day
 */
export function useDailyQuote() {
  // Get today's date in YYYY-MM-DD format
  const today = useMemo(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }, []);

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
