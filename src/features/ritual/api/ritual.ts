/**
 * Quick Ritual API functions
 */

import { createClient } from "@/lib/supabase/client";
import type { RitualResponse, RitualResponseInsert, MoodType } from "@/types/database";

const supabase = createClient();

/**
 * Get user's ritual response for a date
 */
export async function getRitualResponse(
  userId: string,
  date: string
): Promise<RitualResponse | null> {
  const { data, error } = await supabase
    .from("ritual_responses")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching ritual response:", error);
  }
  return data;
}

/**
 * Get partner's ritual response for a date
 */
export async function getPartnerRitualResponse(
  partnerId: string,
  date: string
): Promise<RitualResponse | null> {
  return getRitualResponse(partnerId, date);
}

/**
 * Submit/update ritual response
 */
export async function submitRitualResponse(
  userId: string,
  date: string,
  mood?: MoodType,
  energy?: number,
  vibe?: string
): Promise<RitualResponse | null> {
  // Get existing response to preserve partial progress
  const existing = await getRitualResponse(userId, date);

  const input: RitualResponseInsert = {
    user_id: userId,
    date,
    mood: mood ?? existing?.mood,
    energy: energy ?? existing?.energy,
    vibe: vibe ?? existing?.vibe,
    completed: !!(
      (mood ?? existing?.mood) &&
      (energy ?? existing?.energy) &&
      (vibe ?? existing?.vibe)
    ),
  };

  const { data, error } = await supabase
    .from("ritual_responses")
    .upsert(input, { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) {
    console.error("Error submitting ritual response:", error);
    return null;
  }
  return data;
}

/**
 * Complete ritual in one go
 */
export async function completeRitual(
  userId: string,
  date: string,
  mood: MoodType,
  energy: number,
  vibe: string
): Promise<RitualResponse | null> {
  const input: RitualResponseInsert = {
    user_id: userId,
    date,
    mood,
    energy,
    vibe,
    completed: true,
  };

  const { data, error } = await supabase
    .from("ritual_responses")
    .upsert(input, { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) {
    console.error("Error completing ritual:", error);
    return null;
  }
  return data;
}
