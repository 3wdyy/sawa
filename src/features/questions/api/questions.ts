/**
 * Daily Questions API functions
 */

import { createClient } from "@/lib/supabase/client";
import type { DailyQuestion, QuestionResponse, QuestionResponseInsert } from "@/types/database";

const supabase = createClient();

/**
 * Get today's daily question via server API
 * Server handles assignment with service role key to bypass RLS
 */
export async function getTodaysQuestion(date: string): Promise<DailyQuestion | null> {
  try {
    const response = await fetch(`/api/questions/today?date=${date}`);
    if (!response.ok) {
      console.error("Failed to get question:", response.status);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching question:", error);
    return null;
  }
}

/**
 * Get user's response for today's question
 */
export async function getQuestionResponse(
  userId: string,
  date: string
): Promise<QuestionResponse | null> {
  const { data, error } = await supabase
    .from("question_responses")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching question response:", error);
  }
  return data;
}

/**
 * Get partner's response for today's question
 */
export async function getPartnerQuestionResponse(
  partnerId: string,
  date: string
): Promise<QuestionResponse | null> {
  return getQuestionResponse(partnerId, date);
}

/**
 * Submit answer to today's question
 */
export async function submitQuestionResponse(
  input: QuestionResponseInsert
): Promise<QuestionResponse | null> {
  const { data, error } = await supabase
    .from("question_responses")
    .upsert(input, { onConflict: "user_id,date" })
    .select()
    .single();

  if (error) {
    console.error("Error submitting question response:", error);
    return null;
  }
  return data;
}

/**
 * Shuffle question (get a new one for today)
 * Returns null if shuffle limit reached (1 per day)
 */
export async function shuffleQuestion(
  userId: string,
  date: string
): Promise<DailyQuestion | null> {
  // Check shuffle count
  const response = await getQuestionResponse(userId, date);
  if (response && (response.shuffles_used || 0) >= 1) {
    return null; // Already used shuffle
  }

  // Get current assignment
  const { data: currentAssignment } = await supabase
    .from("daily_question_assignments")
    .select("question_id")
    .eq("date", date)
    .single();

  // Delete current assignment
  if (currentAssignment) {
    await supabase
      .from("daily_question_assignments")
      .delete()
      .eq("date", date);
  }

  // Increment shuffle count if user has a response
  if (response) {
    await supabase
      .from("question_responses")
      .update({ shuffles_used: (response.shuffles_used || 0) + 1 })
      .eq("id", response.id);
  }

  // Get new question
  return getTodaysQuestion(date);
}
