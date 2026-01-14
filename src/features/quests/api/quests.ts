/**
 * Quests API functions
 */

import { createClient } from "@/lib/supabase/client";
import type { Quest, QuestProgress } from "@/types/database";

const supabase = createClient();

/**
 * Get all active quests
 */
export async function getActiveQuests(): Promise<Quest[]> {
  const { data, error } = await supabase
    .from("quests")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching quests:", error);
    return [];
  }
  return data || [];
}

/**
 * Get daily quests
 */
export async function getDailyQuests(): Promise<Quest[]> {
  const { data, error } = await supabase
    .from("quests")
    .select("*")
    .eq("is_active", true)
    .eq("quest_type", "daily");

  if (error) {
    console.error("Error fetching daily quests:", error);
    return [];
  }
  return data || [];
}

/**
 * Get quest progress for a date
 */
export async function getQuestProgressForDate(date: string): Promise<QuestProgress[]> {
  const { data, error } = await supabase
    .from("quest_progress")
    .select(`
      *,
      quest:quests(*)
    `)
    .eq("date", date);

  if (error) {
    console.error("Error fetching quest progress:", error);
    return [];
  }
  return data || [];
}

/**
 * Complete a quest for a date
 */
export async function completeQuest(
  questId: string,
  date: string
): Promise<QuestProgress | null> {
  const { data, error } = await supabase
    .from("quest_progress")
    .upsert(
      {
        quest_id: questId,
        date,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "quest_id,date" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error completing quest:", error);
    return null;
  }
  return data;
}

/**
 * Check if a quest is completed for a date
 */
export async function isQuestCompleted(
  questId: string,
  date: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("quest_progress")
    .select("completed")
    .eq("quest_id", questId)
    .eq("date", date)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking quest completion:", error);
  }
  return data?.completed || false;
}

/**
 * Get completed quests count for this week
 */
export async function getWeeklyQuestCount(): Promise<number> {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const { data, error } = await supabase
    .from("quest_progress")
    .select("id", { count: "exact" })
    .eq("completed", true)
    .gte("date", startOfWeek.toISOString().split("T")[0]);

  if (error) {
    console.error("Error counting weekly quests:", error);
    return 0;
  }
  return data?.length || 0;
}
