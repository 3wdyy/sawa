export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity: Database["public"]["Enums"]["activity_type"]
          created_at: string | null
          description: string
          id: string
          target_id: string | null
          target_type: string | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          activity: Database["public"]["Enums"]["activity_type"]
          created_at?: string | null
          description: string
          id?: string
          target_id?: string | null
          target_type?: string | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          activity?: Database["public"]["Enums"]["activity_type"]
          created_at?: string | null
          description?: string
          id?: string
          target_id?: string | null
          target_type?: string | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          created_at: string | null
          date: string
          id: string
          mood: Database["public"]["Enums"]["mood_type"]
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          mood: Database["public"]["Enums"]["mood_type"]
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          mood?: Database["public"]["Enums"]["mood_type"]
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      couple: {
        Row: {
          created_at: string | null
          id: string
          level: number | null
          total_xp: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level?: number | null
          total_xp?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number | null
          total_xp?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_question_assignments: {
        Row: {
          created_at: string | null
          date: string
          id: string
          question_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          question_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_question_assignments_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "daily_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_questions: {
        Row: {
          category: Database["public"]["Enums"]["question_category"]
          created_at: string | null
          id: string
          is_active: boolean | null
          options: Json | null
          question: string
          question_type: Database["public"]["Enums"]["question_type"]
        }
        Insert: {
          category: Database["public"]["Enums"]["question_category"]
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          question: string
          question_type: Database["public"]["Enums"]["question_type"]
        }
        Update: {
          category?: Database["public"]["Enums"]["question_category"]
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json | null
          question?: string
          question_type?: Database["public"]["Enums"]["question_type"]
        }
        Relationships: []
      }
      daily_quote_assignments: {
        Row: {
          created_at: string | null
          date: string
          id: string
          quote_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          quote_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_quote_assignments_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "daily_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_quotes: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          quote: string
          source: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          quote: string
          source?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          quote?: string
          source?: string | null
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          created_at: string
          date: string
          habit_id: string
          id: string
          logged_at: string
          user_id: string
          value: Json
        }
        Insert: {
          created_at?: string
          date: string
          habit_id: string
          id?: string
          logged_at?: string
          user_id: string
          value?: Json
        }
        Update: {
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          logged_at?: string
          user_id?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          category: Database["public"]["Enums"]["habit_category"]
          created_at: string
          description: string | null
          display_order: number
          icon: string
          id: string
          is_active: boolean
          name: string
          prayer_name: Database["public"]["Enums"]["prayer_name"] | null
          slug: string
          type: Database["public"]["Enums"]["habit_type"]
        }
        Insert: {
          category: Database["public"]["Enums"]["habit_category"]
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          prayer_name?: Database["public"]["Enums"]["prayer_name"] | null
          slug: string
          type: Database["public"]["Enums"]["habit_type"]
        }
        Update: {
          category?: Database["public"]["Enums"]["habit_category"]
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          prayer_name?: Database["public"]["Enums"]["prayer_name"] | null
          slug?: string
          type?: Database["public"]["Enums"]["habit_type"]
        }
        Relationships: []
      }
      inbox_items: {
        Row: {
          added_by: string
          category: Database["public"]["Enums"]["inbox_category"]
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          title: string
        }
        Insert: {
          added_by: string
          category: Database["public"]["Enums"]["inbox_category"]
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          title: string
        }
        Update: {
          added_by?: string
          category?: Database["public"]["Enums"]["inbox_category"]
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "inbox_items_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          date: string
          id: string
          quest_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          date: string
          id?: string
          quest_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          date?: string
          id?: string
          quest_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      question_responses: {
        Row: {
          answer: string
          created_at: string | null
          date: string
          id: string
          question_id: string
          shuffles_used: number | null
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          date: string
          id?: string
          question_id: string
          shuffles_used?: number | null
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          date?: string
          id?: string
          question_id?: string
          shuffles_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "daily_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          conditions: Json
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          quest_type: string
          title: string
          xp_reward: number
        }
        Insert: {
          conditions: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          quest_type: string
          title: string
          xp_reward: number
        }
        Update: {
          conditions?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          quest_type?: string
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string | null
          from_user_id: string
          id: string
          reaction: Database["public"]["Enums"]["reaction_type"]
          target_id: string
          target_type: string
          to_user_id: string
        }
        Insert: {
          created_at?: string | null
          from_user_id: string
          id?: string
          reaction: Database["public"]["Enums"]["reaction_type"]
          target_id: string
          target_type: string
          to_user_id: string
        }
        Update: {
          created_at?: string | null
          from_user_id?: string
          id?: string
          reaction?: Database["public"]["Enums"]["reaction_type"]
          target_id?: string
          target_type?: string
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ritual_responses: {
        Row: {
          completed: boolean | null
          created_at: string | null
          date: string
          energy: number | null
          id: string
          mood: Database["public"]["Enums"]["mood_type"] | null
          user_id: string
          vibe: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          date: string
          energy?: number | null
          id?: string
          mood?: Database["public"]["Enums"]["mood_type"] | null
          user_id: string
          vibe?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          date?: string
          energy?: number | null
          id?: string
          mood?: Database["public"]["Enums"]["mood_type"] | null
          user_id?: string
          vibe?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ritual_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_habits: {
        Row: {
          created_at: string
          habit_id: string
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          habit_id: string
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          habit_id?: string
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_habits_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          id: string
          name: string
          partner_id: string | null
          slug: string
          timezone: string
          updated_at: string
          xp: number | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name: string
          partner_id?: string | null
          slug: string
          timezone?: string
          updated_at?: string
          xp?: number | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          partner_id?: string | null
          slug?: string
          timezone?: string
          updated_at?: string
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wishes: {
        Row: {
          created_at: string | null
          description: string | null
          fulfilled: boolean | null
          fulfilled_at: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fulfilled?: boolean | null
          fulfilled_at?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fulfilled?: boolean | null
          fulfilled_at?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type:
        | "habit_complete"
        | "prayer_complete"
        | "question_answered"
        | "checkin_complete"
        | "ritual_complete"
        | "reaction_sent"
        | "quest_complete"
        | "level_up"
        | "inbox_added"
        | "wish_added"
      habit_category: "religious" | "relationship" | "health" | "productivity"
      habit_type: "binary" | "prayer" | "dual_confirm"
      inbox_category: "idea" | "todo" | "dream" | "memory"
      mood_type: "great" | "okay" | "low" | "stressed" | "tired" | "excited"
      prayer_name: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"
      question_category:
        | "mood"
        | "relationship"
        | "fun"
        | "dreams"
        | "memories"
        | "daily_life"
        | "preferences"
      question_type:
        | "emoji_pick"
        | "this_or_that"
        | "scale"
        | "quick_vibe"
        | "one_word"
        | "fill_blank"
      reaction_type: "heart" | "celebrate"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_type: [
        "habit_complete",
        "prayer_complete",
        "question_answered",
        "checkin_complete",
        "ritual_complete",
        "reaction_sent",
        "quest_complete",
        "level_up",
        "inbox_added",
        "wish_added",
      ],
      habit_category: ["religious", "relationship", "health", "productivity"],
      habit_type: ["binary", "prayer", "dual_confirm"],
      inbox_category: ["idea", "todo", "dream", "memory"],
      mood_type: ["great", "okay", "low", "stressed", "tired", "excited"],
      prayer_name: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
      question_category: [
        "mood",
        "relationship",
        "fun",
        "dreams",
        "memories",
        "daily_life",
        "preferences",
      ],
      question_type: [
        "emoji_pick",
        "this_or_that",
        "scale",
        "quick_vibe",
        "one_word",
        "fill_blank",
      ],
      reaction_type: ["heart", "celebrate"],
    },
  },
} as const

// ============================================
// Convenience Type Aliases
// ============================================

// Core V1 types
export type User = Tables<"users">;
export type Habit = Tables<"habits">;
export type UserHabit = Tables<"user_habits">;
export type HabitLog = Tables<"habit_logs">;
export type HabitLogValue = { done: boolean; on_time?: boolean };

// Prayer types
export type PrayerName = Database["public"]["Enums"]["prayer_name"];

// V2 types
export type Couple = Tables<"couple">;
export type DailyQuestion = Tables<"daily_questions">;
export type DailyQuestionAssignment = Tables<"daily_question_assignments">;
export type QuestionResponse = Tables<"question_responses">;
export type CheckIn = Tables<"check_ins">;
export type RitualResponse = Tables<"ritual_responses">;
export type Reaction = Tables<"reactions">;
export type Quest = Tables<"quests">;
export type QuestProgress = Tables<"quest_progress">;
export type DailyQuote = Tables<"daily_quotes">;
export type DailyQuoteAssignment = Tables<"daily_quote_assignments">;
export type Wish = Tables<"wishes">;
export type InboxItem = Tables<"inbox_items">;
export type ActivityLog = Tables<"activity_log">;

// Enum types
export type QuestionType = Database["public"]["Enums"]["question_type"];
export type QuestionCategory = Database["public"]["Enums"]["question_category"];
export type MoodType = Database["public"]["Enums"]["mood_type"];
export type ReactionType = Database["public"]["Enums"]["reaction_type"];
export type InboxCategory = Database["public"]["Enums"]["inbox_category"];
export type ActivityType = Database["public"]["Enums"]["activity_type"];

// Insert types
export type CoupleInsert = TablesInsert<"couple">;
export type QuestionResponseInsert = TablesInsert<"question_responses">;
export type CheckInInsert = TablesInsert<"check_ins">;
export type RitualResponseInsert = TablesInsert<"ritual_responses">;
export type ReactionInsert = TablesInsert<"reactions">;
export type QuestProgressInsert = TablesInsert<"quest_progress">;
export type WishInsert = TablesInsert<"wishes">;
export type InboxItemInsert = TablesInsert<"inbox_items">;
export type ActivityLogInsert = TablesInsert<"activity_log">;
