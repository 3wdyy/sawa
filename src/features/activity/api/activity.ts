/**
 * Activity Feed API functions
 */

import { createClient } from "@/lib/supabase/client";
import type { ActivityLog, ActivityLogInsert, ActivityType } from "@/types/database";

const supabase = createClient();

/**
 * Log an activity
 */
export async function logActivity(
  userId: string,
  activity: ActivityType,
  description: string,
  targetType?: string,
  targetId?: string,
  xpEarned?: number
): Promise<ActivityLog | null> {
  const input: ActivityLogInsert = {
    user_id: userId,
    activity,
    description,
    target_type: targetType,
    target_id: targetId,
    xp_earned: xpEarned,
  };

  const { data, error } = await supabase
    .from("activity_log")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("Error logging activity:", error);
    return null;
  }
  return data;
}

/**
 * Get recent activity for both users
 */
export async function getRecentActivity(limit = 20): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activity:", error);
    return [];
  }
  return data || [];
}

/**
 * Get activity for a specific user
 */
export async function getUserActivity(userId: string, limit = 20): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching user activity:", error);
    return [];
  }
  return data || [];
}

/**
 * Get activity for today
 */
export async function getTodaysActivity(): Promise<ActivityLog[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .gte("created_at", `${today}T00:00:00`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching today's activity:", error);
    return [];
  }
  return data || [];
}

/**
 * Get activity by type
 */
export async function getActivityByType(
  activityType: ActivityType,
  limit = 20
): Promise<ActivityLog[]> {
  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .eq("activity", activityType)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activity by type:", error);
    return [];
  }
  return data || [];
}
