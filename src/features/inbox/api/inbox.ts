/**
 * Shared Inbox API functions
 */

import { createClient } from "@/lib/supabase/client";
import type { InboxItem, InboxItemInsert, InboxCategory } from "@/types/database";

const supabase = createClient();

/**
 * Get all inbox items
 */
export async function getAllInboxItems(): Promise<InboxItem[]> {
  const { data, error } = await supabase
    .from("inbox_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inbox items:", error);
    return [];
  }
  return data || [];
}

/**
 * Get inbox items by category
 */
export async function getInboxItemsByCategory(category: InboxCategory): Promise<InboxItem[]> {
  const { data, error } = await supabase
    .from("inbox_items")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inbox items by category:", error);
    return [];
  }
  return data || [];
}

/**
 * Add item to inbox
 */
export async function addInboxItem(
  addedBy: string,
  category: InboxCategory,
  title: string,
  notes?: string
): Promise<InboxItem | null> {
  const input: InboxItemInsert = {
    added_by: addedBy,
    category,
    title,
    notes,
  };

  const { data, error } = await supabase
    .from("inbox_items")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("Error adding inbox item:", error);
    return null;
  }
  return data;
}

/**
 * Complete an inbox item (for todos)
 */
export async function completeInboxItem(itemId: string): Promise<InboxItem | null> {
  const { data, error } = await supabase
    .from("inbox_items")
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    console.error("Error completing inbox item:", error);
    return null;
  }
  return data;
}

/**
 * Delete an inbox item
 */
export async function deleteInboxItem(itemId: string): Promise<boolean> {
  const { error } = await supabase
    .from("inbox_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Error deleting inbox item:", error);
    return false;
  }
  return true;
}

/**
 * Get uncompleted inbox items
 */
export async function getUncompletedInboxItems(): Promise<InboxItem[]> {
  const { data, error } = await supabase
    .from("inbox_items")
    .select("*")
    .eq("completed", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching uncompleted inbox items:", error);
    return [];
  }
  return data || [];
}
