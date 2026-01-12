"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserHabits, logHabit, removeHabitLog } from "../api/habits";
import { useAuth } from "@/features/auth/context";
import { getTodayInTimezone } from "@/lib/utils/date";
import type { Habit, HabitLog, UserHabit } from "@/types/database";

export type UserHabitWithLog = UserHabit & { habit: Habit; log: HabitLog | null };

/**
 * Hook for fetching and managing current user's habits
 */
export function useHabits() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const today = user ? getTodayInTimezone(user.timezone) : "";
  const queryKey = ["habits", user?.id, today];

  // Fetch user's habits
  const {
    data: habits,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchUserHabits(user!.id, today),
    enabled: !!user,
  });

  // Complete a habit
  const completeMutation = useMutation({
    mutationFn: ({ habitId }: { habitId: string }) =>
      logHabit(user!.id, habitId, today),
    onMutate: async ({ habitId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousHabits = queryClient.getQueryData<UserHabitWithLog[]>(queryKey);

      // Optimistically update
      if (previousHabits) {
        queryClient.setQueryData<UserHabitWithLog[]>(queryKey, (old) =>
          old?.map((h) =>
            h.habit_id === habitId
              ? {
                  ...h,
                  log: {
                    id: "temp-" + Date.now(),
                    user_id: user!.id,
                    habit_id: habitId,
                    date: today,
                    value: { done: true },
                    logged_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                  },
                }
              : h
          )
        );
      }

      return { previousHabits };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousHabits) {
        queryClient.setQueryData(queryKey, context.previousHabits);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Uncomplete a habit
  const uncompleteMutation = useMutation({
    mutationFn: ({ habitId }: { habitId: string }) =>
      removeHabitLog(user!.id, habitId, today),
    onMutate: async ({ habitId }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousHabits = queryClient.getQueryData<UserHabitWithLog[]>(queryKey);

      if (previousHabits) {
        queryClient.setQueryData<UserHabitWithLog[]>(queryKey, (old) =>
          old?.map((h) =>
            h.habit_id === habitId ? { ...h, log: null } : h
          )
        );
      }

      return { previousHabits };
    },
    onError: (err, variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(queryKey, context.previousHabits);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Toggle a habit (complete/uncomplete)
  const toggleHabit = (habitId: string, isCompleted: boolean) => {
    if (isCompleted) {
      uncompleteMutation.mutate({ habitId });
    } else {
      completeMutation.mutate({ habitId });
    }
  };

  // Helper to check if a habit is completed
  const isCompleted = (habitId: string): boolean => {
    const habit = habits?.find((h) => h.habit_id === habitId);
    return !!habit?.log;
  };

  // Group habits by category
  const habitsByCategory = habits?.reduce(
    (acc, h) => {
      const category = h.habit.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(h);
      return acc;
    },
    {} as Record<string, UserHabitWithLog[]>
  );

  // Sort habits within each category by display_order
  if (habitsByCategory) {
    Object.values(habitsByCategory).forEach((categoryHabits) => {
      categoryHabits.sort((a, b) => a.habit.display_order - b.habit.display_order);
    });
  }

  return {
    habits: habits || [],
    habitsByCategory: habitsByCategory || {},
    isLoading,
    error,
    toggleHabit,
    isCompleted,
    isToggling: completeMutation.isPending || uncompleteMutation.isPending,
  };
}
