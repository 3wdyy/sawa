/**
 * Daily Questions API functions
 */

import { createClient } from "@/lib/supabase/client";
import type { DailyQuestion, QuestionResponse, QuestionResponseInsert } from "@/types/database";

const supabase = createClient();

/**
 * Get today's daily question
 * If no question is assigned for today, assigns a random one
 */
export async function getTodaysQuestion(date: string): Promise<DailyQuestion | null> {
  // Check if there's already an assigned question for today
  const { data: assignment } = await supabase
    .from("daily_question_assignments")
    .select(`
      *,
      question:daily_questions(*)
    `)
    .eq("date", date)
    .single();

  if (assignment?.question) {
    return assignment.question as unknown as DailyQuestion;
  }

  // No question assigned, pick a random one that wasn't used recently
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get questions used in last 30 days
  const { data: recentAssignments } = await supabase
    .from("daily_question_assignments")
    .select("question_id")
    .gte("date", thirtyDaysAgo.toISOString().split("T")[0]);

  const recentQuestionIds = recentAssignments?.map((a) => a.question_id) || [];

  // Get a random question not used recently
  let query = supabase
    .from("daily_questions")
    .select("*")
    .eq("is_active", true);

  if (recentQuestionIds.length > 0) {
    query = query.not("id", "in", `(${recentQuestionIds.join(",")})`);
  }

  const { data: questions } = await query;

  if (!questions || questions.length === 0) {
    // Fallback: get any active question
    const { data: anyQuestion } = await supabase
      .from("daily_questions")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .single();

    if (!anyQuestion) return null;

    // Assign it to today
    await supabase.from("daily_question_assignments").insert({
      question_id: anyQuestion.id,
      date,
    });

    return anyQuestion;
  }

  // Pick a random question
  const randomIndex = Math.floor(Math.random() * questions.length);
  const selectedQuestion = questions[randomIndex];

  // Assign it to today
  await supabase.from("daily_question_assignments").insert({
    question_id: selectedQuestion.id,
    date,
  });

  return selectedQuestion;
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
