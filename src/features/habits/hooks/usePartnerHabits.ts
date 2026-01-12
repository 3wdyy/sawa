"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPartnerHabits } from "../api/habits";
import { useAuth } from "@/features/auth/context";
import { getTodayInTimezone } from "@/lib/utils/date";
import { createClient } from "@/lib/supabase/client";
import type { UserHabitWithLog } from "./useHabits";
import type { HabitLog } from "@/types/database";

/**
 * Hook for fetching partner's habits with real-time updates
 */
export function usePartnerHabits() {
  const { partner } = useAuth();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const today = partner ? getTodayInTimezone(partner.timezone) : "";
  const queryKey = ["partnerHabits", partner?.id, today];

  // Fetch partner's habits
  const {
    data: habits,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchPartnerHabits(partner!.id, today),
    enabled: !!partner,
  });

  // Real-time subscription for partner's habit logs
  useEffect(() => {
    if (!partner) return;

    const channel = supabase
      .channel(`partner-habits-${partner.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "habit_logs",
          filter: `user_id=eq.${partner.id}`,
        },
        (payload) => {
          // Update the cache when partner's logs change
          queryClient.setQueryData<UserHabitWithLog[]>(queryKey, (old) => {
            if (!old) return old;

            if (payload.eventType === "INSERT") {
              const newLog = payload.new as HabitLog;
              return old.map((h) =>
                h.habit_id === newLog.habit_id ? { ...h, log: newLog } : h
              );
            }

            if (payload.eventType === "DELETE") {
              const deletedLog = payload.old as HabitLog;
              return old.map((h) =>
                h.habit_id === deletedLog.habit_id ? { ...h, log: null } : h
              );
            }

            if (payload.eventType === "UPDATE") {
              const updatedLog = payload.new as HabitLog;
              return old.map((h) =>
                h.habit_id === updatedLog.habit_id
                  ? { ...h, log: updatedLog }
                  : h
              );
            }

            return old;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partner, queryClient, queryKey, supabase]);

  // Helper to check if partner completed a habit
  const isCompleted = (habitId: string): boolean => {
    const habit = habits?.find((h) => h.habit_id === habitId);
    return !!habit?.log;
  };

  // Count completed habits
  const completedCount = habits?.filter((h) => h.log).length || 0;
  const totalCount = habits?.length || 0;

  return {
    habits: habits || [],
    isLoading,
    error,
    isCompleted,
    completedCount,
    totalCount,
    progressPercent: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
  };
}
