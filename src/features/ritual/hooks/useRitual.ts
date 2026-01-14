"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context";
import { useCoupleProgress } from "@/features/couple/hooks/useCoupleProgress";
import {
  getRitualResponse,
  getPartnerRitualResponse,
  completeRitual,
} from "../api/ritual";
import type { MoodType } from "@/types/database";

const XP_FOR_RITUAL = 15;

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Hook for managing Quick Ritual (3-tap flow)
 */
export function useRitual() {
  const { user, partner } = useAuth();
  const queryClient = useQueryClient();
  const { addXp } = useCoupleProgress();
  const today = getToday();

  const myRitualKey = ["ritual", user?.id, today];
  const partnerRitualKey = ["ritual", partner?.id, today];

  // Fetch my ritual response
  const {
    data: myRitual,
    isLoading: myLoading,
  } = useQuery({
    queryKey: myRitualKey,
    queryFn: () => getRitualResponse(user!.id, today),
    enabled: !!user,
  });

  // Fetch partner's ritual response
  const {
    data: partnerRitual,
    isLoading: partnerLoading,
  } = useQuery({
    queryKey: partnerRitualKey,
    queryFn: () => getPartnerRitualResponse(partner!.id, today),
    enabled: !!partner,
  });

  // Complete ritual mutation
  const completeMutation = useMutation({
    mutationFn: async ({
      mood,
      energy,
      vibe,
    }: {
      mood: MoodType;
      energy: number;
      vibe: string;
    }) => {
      if (!user) throw new Error("No user");
      return completeRitual(user.id, today, mood, energy, vibe);
    },
    onSuccess: () => {
      // Award XP
      addXp(XP_FOR_RITUAL);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: myRitualKey });
    },
  });

  const hasCompleted = myRitual?.completed ?? false;
  const partnerHasCompleted = partnerRitual?.completed ?? false;

  return {
    myRitual,
    partnerRitual,
    hasCompleted,
    partnerHasCompleted,
    isLoading: myLoading || partnerLoading,
    complete: (mood: MoodType, energy: number, vibe: string) =>
      completeMutation.mutate({ mood, energy, vibe }),
    isSubmitting: completeMutation.isPending,
  };
}
