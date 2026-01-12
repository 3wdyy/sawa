/**
 * Database types for Sawa
 * These should match the Supabase schema
 * Can be regenerated with: npx supabase gen types typescript
 */

// Enum types matching database
export type HabitType = "binary" | "prayer" | "dual_confirm";
export type HabitCategory = "religious" | "relationship" | "health" | "productivity";
export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

// Table row types
export interface User {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  city: string | null;
  country: string | null;
  partner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  name: string;
  slug: string;
  type: HabitType;
  category: HabitCategory;
  icon: string;
  prayer_name: PrayerName | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserHabit {
  id: string;
  user_id: string;
  habit_id: string;
  is_active: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  user_id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  value: HabitLogValue;
  logged_at: string;
  created_at: string;
}

// Value types for different habit types
export interface BinaryValue {
  done: boolean;
}

export interface PrayerValue {
  done: boolean;
  on_time?: boolean;
}

export interface DualConfirmValue {
  done: boolean;
}

export type HabitLogValue = BinaryValue | PrayerValue | DualConfirmValue;

// Supabase Database type for client
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<User, "id" | "created_at">>;
      };
      habits: {
        Row: Habit;
        Insert: Omit<Habit, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Habit, "id" | "created_at">>;
      };
      user_habits: {
        Row: UserHabit;
        Insert: Omit<UserHabit, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<UserHabit, "id" | "created_at">>;
      };
      habit_logs: {
        Row: HabitLog;
        Insert: Omit<HabitLog, "id" | "created_at" | "logged_at"> & {
          id?: string;
          created_at?: string;
          logged_at?: string;
        };
        Update: Partial<Omit<HabitLog, "id" | "created_at">>;
      };
    };
    Enums: {
      habit_type: HabitType;
      habit_category: HabitCategory;
      prayer_name: PrayerName;
    };
  };
}

// Convenience types for queries
export type UserWithPartner = User & {
  partner?: User | null;
};

export type HabitWithLog = Habit & {
  log?: HabitLog | null;
  is_completed: boolean;
};

export type UserHabitWithDetails = UserHabit & {
  habit: Habit;
  log?: HabitLog | null;
};
