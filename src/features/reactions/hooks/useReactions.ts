"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context";
import { useCoupleProgress } from "@/features/couple/hooks/useCoupleProgress";
import { sendReaction } from "../api/reactions";
import type { ReactionType } from "@/types/database";

const XP_FOR_REACTION = 5;

/**
 * Hook for sending reactions to partner completions
 * Reactions: heart (❤️) and celebrate (🎉)
 */
export function useReactions() {
  const { user, partner } = useAuth();
  const queryClient = useQueryClient();
  const { addXp } = useCoupleProgress();

  // Send reaction mutation
  const sendMutation = useMutation({
    mutationFn: async ({
      targetType,
      targetId,
      reaction,
    }: {
      targetType: string;
      targetId: string;
      reaction: ReactionType;
    }) => {
      if (!user || !partner) throw new Error("No user or partner");
      return sendReaction(user.id, partner.id, targetType, targetId, reaction);
    },
    onSuccess: () => {
      // Award XP for sending a reaction
      addXp(XP_FOR_REACTION);
      // Invalidate activity feed
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
    },
  });

  const react = (
    targetType: string,
    targetId: string,
    reaction: ReactionType
  ) => {
    sendMutation.mutate({ targetType, targetId, reaction });
  };

  return {
    react,
    sendHeart: (targetType: string, targetId: string) =>
      react(targetType, targetId, "heart"),
    sendCelebrate: (targetType: string, targetId: string) =>
      react(targetType, targetId, "celebrate"),
    isReacting: sendMutation.isPending,
  };
}
