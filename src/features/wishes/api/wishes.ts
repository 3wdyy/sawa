/**
 * Wishes API functions
 */

import { createClient } from "@/lib/supabase/client";
import type { Wish, WishInsert } from "@/types/database";

const supabase = createClient();

/**
 * Get user's wishes
 */
export async function getUserWishes(userId: string): Promise<Wish[]> {
  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wishes:", error);
    return [];
  }
  return data || [];
}

/**
 * Get partner's wishes (for gift ideas!)
 */
export async function getPartnerWishes(partnerId: string): Promise<Wish[]> {
  return getUserWishes(partnerId);
}

/**
 * Add a new wish
 */
export async function addWish(
  userId: string,
  title: string,
  description?: string
): Promise<Wish | null> {
  const input: WishInsert = {
    user_id: userId,
    title,
    description,
  };

  const { data, error } = await supabase
    .from("wishes")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("Error adding wish:", error);
    return null;
  }
  return data;
}

/**
 * Fulfill a wish (mark as done)
 */
export async function fulfillWish(wishId: string): Promise<Wish | null> {
  const { data, error } = await supabase
    .from("wishes")
    .update({
      fulfilled: true,
      fulfilled_at: new Date().toISOString(),
    })
    .eq("id", wishId)
    .select()
    .single();

  if (error) {
    console.error("Error fulfilling wish:", error);
    return null;
  }
  return data;
}

/**
 * Delete a wish
 */
export async function deleteWish(wishId: string): Promise<boolean> {
  const { error } = await supabase
    .from("wishes")
    .delete()
    .eq("id", wishId);

  if (error) {
    console.error("Error deleting wish:", error);
    return false;
  }
  return true;
}

/**
 * Get unfulfilled wishes
 */
export async function getUnfulfilledWishes(userId: string): Promise<Wish[]> {
  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .eq("user_id", userId)
    .eq("fulfilled", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching unfulfilled wishes:", error);
    return [];
  }
  return data || [];
}
