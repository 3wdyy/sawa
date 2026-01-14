/**
 * Daily Check-in API functions
 */

import { createClient } from "@/lib/supabase/client";
import type { CheckIn, CheckInInsert, MoodType } from "@/types/database";

const supabase = createClient();

/**
 * Get user's check-in for a date
 */
export async function getCheckIn(
  userId: string,
  date: string
): Promise<CheckIn | null> {
  const { data, error } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching check-in:", error);
  }
  return data;
}

/**
 * Get partner's check-in for a date
 */
export async function getPartnerCheckIn(
  partnerId: string,
  date: string
): Promise<CheckIn | null> {
  return getCheckIn(partnerId, date);
}

/**
 * Submit daily check-in
 */
export async function submitCheckIn(
  userId: string,
  date: string,
  mood: MoodType,
  note?: string
): Promise<CheckIn | null> {
  const input: CheckInInsert = {
    user_id: userId,
    date,
    mood,
    note: note?.slice(0, 50), // Max 50 chars
  };

  const { data, error } = await supabase
    .from("check_ins")
    .upsert(input, { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) {
    console.error("Error submitting check-in:", error);
    return null;
  }
  return data;
}

/**
 * Get recent check-ins for a user (last 7 days)
 */
export async function getRecentCheckIns(userId: string): Promise<CheckIn[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", userId)
    .gte("date", sevenDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching recent check-ins:", error);
    return [];
  }
  return data || [];
}
