/**
 * Reactions API functions
 */

import { createClient } from "@/lib/supabase/client";
import type { Reaction, ReactionInsert, ReactionType } from "@/types/database";

const supabase = createClient();

/**
 * Send a reaction to partner
 */
export async function sendReaction(
  fromUserId: string,
  toUserId: string,
  targetType: string,
  targetId: string,
  reaction: ReactionType
): Promise<Reaction | null> {
  const input: ReactionInsert = {
    from_user_id: fromUserId,
    to_user_id: toUserId,
    target_type: targetType,
    target_id: targetId,
    reaction,
  };

  const { data, error } = await supabase
    .from("reactions")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("Error sending reaction:", error);
    return null;
  }
  return data;
}

/**
 * Get reactions for a specific target
 */
export async function getReactionsForTarget(
  targetType: string,
  targetId: string
): Promise<Reaction[]> {
  const { data, error } = await supabase
    .from("reactions")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reactions:", error);
    return [];
  }
  return data || [];
}

/**
 * Get recent reactions received by a user
 */
export async function getRecentReactionsReceived(userId: string): Promise<Reaction[]> {
  const { data, error } = await supabase
    .from("reactions")
    .select("*")
    .eq("to_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching received reactions:", error);
    return [];
  }
  return data || [];
}

/**
 * Delete a reaction
 */
export async function deleteReaction(reactionId: string): Promise<boolean> {
  const { error } = await supabase
    .from("reactions")
    .delete()
    .eq("id", reactionId);

  if (error) {
    console.error("Error deleting reaction:", error);
    return false;
  }
  return true;
}
