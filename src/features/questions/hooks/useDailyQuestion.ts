"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context";
import { useCoupleProgress } from "@/features/couple/hooks/useCoupleProgress";
import {
  getTodaysQuestion,
  getQuestionResponse,
  getPartnerQuestionResponse,
  submitQuestionResponse,
  shuffleQuestion,
} from "../api/questions";
import type { DailyQuestion } from "@/types/database";

const XP_FOR_QUESTION = 25;

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Hook for managing daily question interactions
 */
export function useDailyQuestion() {
  const { user, partner } = useAuth();
  const queryClient = useQueryClient();
  const { addXp } = useCoupleProgress();
  const today = getToday();

  const questionKey = ["daily-question", today];
  const myResponseKey = ["question-response", user?.id, today];
  const partnerResponseKey = ["question-response", partner?.id, today];

  // Fetch today's question
  const {
    data: question,
    isLoading: questionLoading,
  } = useQuery({
    queryKey: questionKey,
    queryFn: () => getTodaysQuestion(today),
    enabled: !!user,
  });

  // Fetch my response
  const {
    data: myResponse,
    isLoading: myResponseLoading,
  } = useQuery({
    queryKey: myResponseKey,
    queryFn: () => getQuestionResponse(user!.id, today),
    enabled: !!user,
  });

  // Fetch partner's response
  const {
    data: partnerResponse,
  } = useQuery({
    queryKey: partnerResponseKey,
    queryFn: () => getPartnerQuestionResponse(partner!.id, today),
    enabled: !!partner,
  });

  // Submit answer mutation
  const answerMutation = useMutation({
    mutationFn: async (answer: string) => {
      if (!user || !question) throw new Error("Missing user or question");
      return submitQuestionResponse({
        user_id: user.id,
        question_id: question.id,
        date: today,
        answer,
      });
    },
    onSuccess: () => {
      // Award XP
      addXp(XP_FOR_QUESTION);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: myResponseKey });
    },
  });

  // Shuffle mutation
  const shuffleMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("No user");
      return shuffleQuestion(user.id, today);
    },
    onSuccess: (newQuestion) => {
      if (newQuestion) {
        queryClient.setQueryData<DailyQuestion>(questionKey, newQuestion);
      }
    },
  });

  // Parse options from question
  const options = question?.options as string[] | null;

  // Can see partner's answer only if I've answered
  const hasAnswered = !!myResponse;
  const partnerHasAnswered = !!partnerResponse;
  const canSeePartnerAnswer = hasAnswered && partnerHasAnswered;
  const shufflesUsed = myResponse?.shuffles_used || 0;
  const canShuffle = !hasAnswered && shufflesUsed < 1;

  return {
    question,
    options,
    myResponse,
    partnerResponse: canSeePartnerAnswer ? partnerResponse : null,
    hasAnswered,
    partnerHasAnswered,
    canSeePartnerAnswer,
    canShuffle,
    shufflesUsed,
    isLoading: questionLoading || myResponseLoading,
    submitAnswer: (answer: string) => answerMutation.mutate(answer),
    shuffle: () => shuffleMutation.mutate(),
    isSubmitting: answerMutation.isPending,
    isShuffling: shuffleMutation.isPending,
  };
}
