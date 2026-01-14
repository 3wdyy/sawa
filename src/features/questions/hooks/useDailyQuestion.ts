"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context";
import { useCoupleProgress } from "@/features/couple/hooks/useCoupleProgress";
import {
  getTodaysQuestion,
  getQuestionResponse,
  getPartnerQuestionResponse,
  submitQuestionResponse,
  shuffleQuestion,
} from "../api/questions";
import { logActivity } from "@/features/activity/api/activity";
import { getSawaDay } from "@/lib/utils/date";
import type { DailyQuestion } from "@/types/database";

const XP_FOR_QUESTION = 25;

// Local storage key for tracking shuffles per user per day
const SHUFFLE_STORAGE_KEY = "sawa_question_shuffles";

/**
 * Hook for managing daily question interactions
 */
/**
 * Get shuffles used from localStorage
 */
function getLocalShuffles(userId: string, date: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const data = localStorage.getItem(SHUFFLE_STORAGE_KEY);
    if (!data) return 0;
    const parsed = JSON.parse(data);
    return parsed[`${userId}_${date}`] || 0;
  } catch {
    return 0;
  }
}

/**
 * Save shuffles used to localStorage
 */
function setLocalShuffles(userId: string, date: string, count: number): void {
  if (typeof window === "undefined") return;
  try {
    const data = localStorage.getItem(SHUFFLE_STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : {};
    // Clean up old dates (keep only current day)
    const cleaned: Record<string, number> = {};
    cleaned[`${userId}_${date}`] = count;
    localStorage.setItem(SHUFFLE_STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    // Ignore storage errors
  }
}

export function useDailyQuestion() {
  const { user, partner } = useAuth();
  const queryClient = useQueryClient();
  const { addXp } = useCoupleProgress();
  // Use Fajr-based day (day resets at Fajr, not midnight)
  const today = user ? getSawaDay(user.timezone) : new Date().toISOString().split("T")[0];

  // Track shuffles in local state (initialized from localStorage)
  const [localShufflesUsed, setLocalShufflesUsed] = useState(0);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (user) {
      setLocalShufflesUsed(getLocalShuffles(user.id, today));
    }
  }, [user, today]);

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
      const response = await submitQuestionResponse({
        user_id: user.id,
        question_id: question.id,
        date: today,
        answer,
      });
      if (response) {
        await logActivity(
          user.id,
          "question_answered",
          `جاوب على سؤال اليوم`,
          "question",
          question.id,
          XP_FOR_QUESTION
        );
      }
      return response;
    },
    onSuccess: () => {
      // Award XP
      addXp(XP_FOR_QUESTION);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: myResponseKey });
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
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
        // Update local shuffle count and persist to localStorage
        const newCount = localShufflesUsed + 1;
        setLocalShufflesUsed(newCount);
        setLocalShuffles(user!.id, today, newCount);
        // Update question in cache
        queryClient.setQueryData<DailyQuestion>(questionKey, newQuestion);
      }
    },
  });

  // Parse options from question
  const options = question?.options as string[] | null;

  // Verify response matches current question (handles sync issues between devices)
  const myResponseValid = myResponse && question && myResponse.question_id === question.id;
  const partnerResponseValid = partnerResponse && question && partnerResponse.question_id === question.id;

  // Can see partner's answer only if I've answered THIS question
  const hasAnswered = !!myResponseValid;
  const partnerHasAnswered = !!partnerResponseValid;
  const canSeePartnerAnswer = hasAnswered && partnerHasAnswered;
  // Use local storage for shuffle tracking (persists across refreshes)
  const shufflesUsed = Math.max(myResponse?.shuffles_used || 0, localShufflesUsed);
  const canShuffle = !hasAnswered && shufflesUsed < 1;

  return {
    question,
    options,
    myResponse: myResponseValid ? myResponse : null,
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
