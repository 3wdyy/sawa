/**
 * Habits API functions
 * Direct Supabase queries for habits data
 */

import { createClient } from "@/lib/supabase/client";
import type { Habit, HabitLog, UserHabit, HabitLogValue } from "@/types/database";

const supabase = createClient();

/**
 * Fetch all habits assigned to a user with their today's logs
 */
export async function fetchUserHabits(
  userId: string,
  date: string
): Promise<(UserHabit & { habit: Habit; log: HabitLog | null })[]> {
  // Fetch user's assigned habits
  const { data: userHabits, error: habitsError } = await supabase
    .from("user_habits")
    .select(`
      *,
      habit:habits(*)
    `)
    .eq("user_id", userId)
    .eq("is_active", true);

  if (habitsError) throw habitsError;
  if (!userHabits) return [];

  // Fetch today's logs for this user
  const { data: logs, error: logsError } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date);

  if (logsError) throw logsError;

  // Combine habits with their logs
  const logsMap = new Map(logs?.map((log) => [log.habit_id, log]) || []);

  return userHabits.map((uh) => ({
    ...uh,
    habit: uh.habit as unknown as Habit,
    log: logsMap.get(uh.habit_id) || null,
  }));
}

/**
 * Fetch partner's habits with their today's logs
 */
export async function fetchPartnerHabits(
  partnerId: string,
  date: string
): Promise<(UserHabit & { habit: Habit; log: HabitLog | null })[]> {
  return fetchUserHabits(partnerId, date);
}

/**
 * Log a habit completion
 */
export async function logHabit(
  userId: string,
  habitId: string,
  date: string,
  value: HabitLogValue = { done: true }
): Promise<HabitLog> {
  // Upsert: insert or update if exists
  const { data, error } = await supabase
    .from("habit_logs")
    .upsert(
      {
        user_id: userId,
        habit_id: habitId,
        date,
        value,
        logged_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,habit_id,date",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove a habit log (uncomplete)
 */
export async function removeHabitLog(
  userId: string,
  habitId: string,
  date: string
): Promise<void> {
  const { error } = await supabase
    .from("habit_logs")
    .delete()
    .eq("user_id", userId)
    .eq("habit_id", habitId)
    .eq("date", date);

  if (error) throw error;
}

/**
 * Toggle a habit completion (complete if not, uncomplete if done)
 */
export async function toggleHabit(
  userId: string,
  habitId: string,
  date: string,
  currentlyCompleted: boolean
): Promise<HabitLog | null> {
  if (currentlyCompleted) {
    await removeHabitLog(userId, habitId, date);
    return null;
  } else {
    return logHabit(userId, habitId, date);
  }
}
