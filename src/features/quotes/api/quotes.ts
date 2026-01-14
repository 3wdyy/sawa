/**
 * Daily Quotes API functions
 */

import { createClient } from "@/lib/supabase/client";
import type { DailyQuote } from "@/types/database";

const supabase = createClient();

/**
 * Get today's daily quote
 * If no quote is assigned for today, assigns a random one
 */
export async function getTodaysQuote(date: string): Promise<DailyQuote | null> {
  // Check if there's already an assigned quote for today
  const { data: assignment } = await supabase
    .from("daily_quote_assignments")
    .select(`
      *,
      quote:daily_quotes(*)
    `)
    .eq("date", date)
    .single();

  if (assignment?.quote) {
    return assignment.quote as unknown as DailyQuote;
  }

  // No quote assigned, pick a random one
  const { data: quotes } = await supabase
    .from("daily_quotes")
    .select("*")
    .eq("is_active", true);

  if (!quotes || quotes.length === 0) return null;

  // Pick a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  // Assign it to today
  await supabase.from("daily_quote_assignments").insert({
    quote_id: selectedQuote.id,
    date,
  });

  return selectedQuote;
}

/**
 * Get all quotes
 */
export async function getAllQuotes(): Promise<DailyQuote[]> {
  const { data, error } = await supabase
    .from("daily_quotes")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
  return data || [];
}

/**
 * Get quotes by category
 */
export async function getQuotesByCategory(category: string): Promise<DailyQuote[]> {
  const { data, error } = await supabase
    .from("daily_quotes")
    .select("*")
    .eq("is_active", true)
    .eq("category", category);

  if (error) {
    console.error("Error fetching quotes by category:", error);
    return [];
  }
  return data || [];
}
