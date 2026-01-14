"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useCoupleProgress } from "@/features/couple/hooks/useCoupleProgress";
import {
  getDailyQuests,
  getQuestProgressForDate,
  completeQuest,
} from "../api/quests";
import type { Quest, QuestProgress } from "@/types/database";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export interface QuestWithProgress extends Quest {
  progress: QuestProgress | null;
  isCompleted: boolean;
}

/**
 * Hook for daily/weekly quests - challenges with variable XP rewards
 */
export function useQuests() {
  const queryClient = useQueryClient();
  const { addXp } = useCoupleProgress();
  const today = getToday();

  const questsKey = useMemo(() => ["quests", "daily"], []);
  const progressKey = useMemo(() => ["quest-progress", today], [today]);

  // Fetch daily quests
  const { data: quests, isLoading: questsLoading } = useQuery({
    queryKey: questsKey,
    queryFn: getDailyQuests,
  });

  // Fetch progress for today
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: progressKey,
    queryFn: () => getQuestProgressForDate(today),
  });

  // Combine quests with progress
  const questsWithProgress: QuestWithProgress[] = useMemo(() => {
    if (!quests) return [];

    return quests.map((quest) => {
      const questProgress = progress?.find((p) => p.quest_id === quest.id) || null;
      return {
        ...quest,
        progress: questProgress,
        isCompleted: questProgress?.completed || false,
      };
    });
  }, [quests, progress]);

  // Complete quest mutation
  const completeMutation = useMutation({
    mutationFn: async (quest: Quest) => {
      const result = await completeQuest(quest.id, today);
      if (result) {
        // Award XP for completing quest
        await addXp(quest.xp_reward);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKey });
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
    },
  });

  // Stats
  const completedCount = questsWithProgress.filter((q) => q.isCompleted).length;
  const totalCount = questsWithProgress.length;
  const totalXpAvailable = questsWithProgress
    .filter((q) => !q.isCompleted)
    .reduce((sum, q) => sum + q.xp_reward, 0);

  return {
    quests: questsWithProgress,
    isLoading: questsLoading || progressLoading,
    complete: (quest: Quest) => completeMutation.mutate(quest),
    isCompleting: completeMutation.isPending,
    completedCount,
    totalCount,
    totalXpAvailable,
  };
}
