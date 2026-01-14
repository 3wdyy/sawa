"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context";
import { useCoupleProgress } from "@/features/couple/hooks/useCoupleProgress";
import {
  getCheckIn,
  getPartnerCheckIn,
  submitCheckIn,
} from "../api/checkin";
import type { MoodType } from "@/types/database";

const XP_FOR_CHECKIN = 10;

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Hook for managing daily check-in (mood pulse)
 */
export function useCheckIn() {
  const { user, partner } = useAuth();
  const queryClient = useQueryClient();
  const { addXp } = useCoupleProgress();
  const today = getToday();

  const myCheckInKey = ["checkin", user?.id, today];
  const partnerCheckInKey = ["checkin", partner?.id, today];

  // Fetch my check-in
  const {
    data: myCheckIn,
    isLoading: myLoading,
  } = useQuery({
    queryKey: myCheckInKey,
    queryFn: () => getCheckIn(user!.id, today),
    enabled: !!user,
  });

  // Fetch partner's check-in
  const {
    data: partnerCheckIn,
    isLoading: partnerLoading,
  } = useQuery({
    queryKey: partnerCheckInKey,
    queryFn: () => getPartnerCheckIn(partner!.id, today),
    enabled: !!partner,
  });

  // Submit check-in mutation
  const submitMutation = useMutation({
    mutationFn: async ({ mood, note }: { mood: MoodType; note?: string }) => {
      if (!user) throw new Error("No user");
      return submitCheckIn(user.id, today, mood, note);
    },
    onSuccess: () => {
      // Award XP only if first check-in today
      if (!myCheckIn) {
        addXp(XP_FOR_CHECKIN);
      }
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: myCheckInKey });
    },
  });

  const hasCheckedIn = !!myCheckIn;
  const partnerHasCheckedIn = !!partnerCheckIn;

  return {
    myCheckIn,
    partnerCheckIn,
    hasCheckedIn,
    partnerHasCheckedIn,
    isLoading: myLoading || partnerLoading,
    submit: (mood: MoodType, note?: string) => submitMutation.mutate({ mood, note }),
    isSubmitting: submitMutation.isPending,
  };
}
