/**
 * Couple API functions
 * Manages couple XP, level, and progress
 */

import { createClient } from "@/lib/supabase/client";
import type { Couple } from "@/types/database";

const supabase = createClient();

// XP thresholds for each level
const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  300,   // Level 3
  600,   // Level 4
  1000,  // Level 5
  1500,  // Level 6
  2200,  // Level 7
  3000,  // Level 8
  4000,  // Level 9
  5200,  // Level 10
];

/**
 * Calculate level from XP
 */
export function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Get XP needed for next level
 */
export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1500 * (currentLevel - LEVEL_THRESHOLDS.length + 1);
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

/**
 * Fetch couple progress
 */
export async function fetchCoupleProgress(): Promise<Couple | null> {
  const { data, error } = await supabase
    .from("couple")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching couple progress:", error);
    return null;
  }
  return data;
}

/**
 * Add XP to couple
 */
export async function addCoupleXp(amount: number): Promise<Couple | null> {
  // First get current XP
  const current = await fetchCoupleProgress();
  if (!current) return null;

  const newXp = (current.total_xp || 0) + amount;
  const newLevel = calculateLevel(newXp);

  const { data, error } = await supabase
    .from("couple")
    .update({
      total_xp: newXp,
      level: newLevel,
    })
    .eq("id", current.id)
    .select()
    .single();

  if (error) {
    console.error("Error adding couple XP:", error);
    return null;
  }

  return data;
}

/**
 * Get progress to next level (percentage 0-100)
 */
export function getProgressToNextLevel(xp: number, level: number): number {
  const currentLevelXp = level <= LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level - 1] : getXpForNextLevel(level - 1);
  const nextLevelXp = getXpForNextLevel(level);
  const xpInLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  return Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
}
