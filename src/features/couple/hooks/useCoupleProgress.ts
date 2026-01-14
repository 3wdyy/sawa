"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCoupleProgress,
  addCoupleXp,
  getProgressToNextLevel,
  getXpForNextLevel,
} from "../api/couple";
import type { Couple } from "@/types/database";

/**
 * Hook for fetching and managing couple XP and level progress
 */
export function useCoupleProgress() {
  const queryClient = useQueryClient();
  const queryKey = ["couple-progress"];

  // Fetch couple progress
  const {
    data: couple,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: fetchCoupleProgress,
  });

  // Add XP mutation
  const addXpMutation = useMutation({
    mutationFn: (amount: number) => addCoupleXp(amount),
    onMutate: async (amount) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousCouple = queryClient.getQueryData<Couple>(queryKey);

      // Optimistically update
      if (previousCouple) {
        const newXp = (previousCouple.total_xp || 0) + amount;
        queryClient.setQueryData<Couple>(queryKey, {
          ...previousCouple,
          total_xp: newXp,
        });
      }

      return { previousCouple };
    },
    onError: (_err, _amount, context) => {
      // Rollback on error
      if (context?.previousCouple) {
        queryClient.setQueryData(queryKey, context.previousCouple);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Calculate derived values
  const totalXp = couple?.total_xp || 0;
  const level = couple?.level || 1;
  const progressPercent = getProgressToNextLevel(totalXp, level);
  const xpToNextLevel = getXpForNextLevel(level);

  return {
    couple,
    totalXp,
    level,
    progressPercent,
    xpToNextLevel,
    isLoading,
    error,
    addXp: (amount: number) => addXpMutation.mutate(amount),
    isAddingXp: addXpMutation.isPending,
  };
}
