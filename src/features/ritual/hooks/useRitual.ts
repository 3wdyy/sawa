"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context";
import { useCoupleProgress } from "@/features/couple/hooks/useCoupleProgress";
import {
  getRitualResponse,
  getPartnerRitualResponse,
  completeRitual,
} from "../api/ritual";
import { logActivity } from "@/features/activity/api/activity";
import { getSawaDay } from "@/lib/utils/date";
import type { MoodType } from "@/types/database";

const XP_FOR_RITUAL = 15;

/**
 * Hook for managing Quick Ritual (3-tap flow)
 */
export function useRitual() {
  const { user, partner } = useAuth();
  const queryClient = useQueryClient();
  const { addXp } = useCoupleProgress();
  // Use Fajr-based day (day resets at Fajr, not midnight)
  const today = user ? getSawaDay(user.timezone) : new Date().toISOString().split("T")[0];

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
      const result = await completeRitual(user.id, today, mood, energy, vibe);
      if (result) {
        await logActivity(
          user.id,
          "ritual_complete",
          `خلّص الـ ritual ✨ - ${vibe}`,
          "ritual",
          result.id,
          XP_FOR_RITUAL
        );
      }
      return result;
    },
    onSuccess: () => {
      // Award XP
      addXp(XP_FOR_RITUAL);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: myRitualKey });
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
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
