"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { getRecentActivity } from "../api/activity";
import type { ActivityLog } from "@/types/database";

const ACTIVITY_LIMIT = 15;

/**
 * Hook for real-time activity feed
 * Shows recent actions from both users with Supabase real-time subscription
 */
export function useActivityFeed() {
  const queryKey = useMemo(() => ["activity-feed"], []);

  const {
    data: activities,
    isLoading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => getRecentActivity(ACTIVITY_LIMIT),
    staleTime: 30000, // 30 seconds
  });

  // Real-time subscription for activity_log table
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("activity-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_log" },
        () => {
          // Refetch on new activity
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return {
    activities: activities || [],
    isLoading,
    refetch,
  };
}

/**
 * Get display info for an activity type
 */
export function getActivityDisplay(activity: ActivityLog): {
  emoji: string;
  text: string;
} {
  const { activity: type, description } = activity;

  const emojiMap: Record<string, string> = {
    habit_complete: "✅",
    prayer_complete: "🕌",
    question_answered: "❓",
    checkin_complete: "💭",
    ritual_complete: "✨",
    reaction_sent: "💕",
    quest_complete: "🏆",
    level_up: "🎉",
    inbox_added: "📥",
    wish_added: "⭐",
  };

  return {
    emoji: emojiMap[type] || "📌",
    text: description,
  };
}

/**
 * Format activity timestamp for display
 */
export function formatActivityTime(timestamp: string | null): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
