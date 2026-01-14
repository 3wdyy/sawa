"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckIn } from "../hooks/useCheckIn";
import { useAuth } from "@/features/auth/context";
import type { MoodType } from "@/types/database";

const MOOD_OPTIONS: { mood: MoodType; emoji: string; label: string }[] = [
  { mood: "great", emoji: "😊", label: "Great" },
  { mood: "okay", emoji: "😐", label: "Okay" },
  { mood: "low", emoji: "😔", label: "Low" },
  { mood: "stressed", emoji: "😤", label: "Stressed" },
  { mood: "tired", emoji: "😴", label: "Tired" },
  { mood: "excited", emoji: "🤩", label: "Excited" },
];

function getMoodEmoji(mood: MoodType): string {
  return MOOD_OPTIONS.find((o) => o.mood === mood)?.emoji || "😐";
}

/**
 * Daily Check-In Card - emoji mood selection with optional note
 */
export function CheckInCard() {
  const { partner } = useAuth();
  const {
    myCheckIn,
    partnerCheckIn,
    hasCheckedIn,
    partnerHasCheckedIn,
    isLoading,
    submit,
    isSubmitting,
  } = useCheckIn();

  const [note, setNote] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  if (isLoading) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-background-secondary rounded w-1/3 mb-3" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-background-secondary rounded flex-1" />
          ))}
        </div>
      </div>
    );
  }

  const handleMoodSelect = (mood: MoodType) => {
    if (hasCheckedIn || isSubmitting) return;
    setSelectedMood(mood);
  };

  const handleSubmit = () => {
    if (!selectedMood || isSubmitting) return;
    submit(selectedMood, note.trim() || undefined);
    setSelectedMood(null);
    setNote("");
  };

  return (
    <motion.div
      className="card p-4 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-lavender flex items-center gap-2">
          <span>💭</span> How are you feeling?
        </span>
        {hasCheckedIn && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-mint/20 text-mint">
            +10 XP
          </span>
        )}
      </div>

      {/* Mood selection - only show if not checked in */}
      {!hasCheckedIn && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {MOOD_OPTIONS.map(({ mood, emoji, label }) => (
              <motion.button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                disabled={isSubmitting}
                className={`py-3 px-2 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                  selectedMood === mood
                    ? "bg-lavender/20 border-lavender"
                    : "bg-background-secondary border-border hover:border-lavender/50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs text-foreground-muted">{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Note input - shown when mood selected */}
          <AnimatePresence>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 50))}
                  placeholder="Quick note (optional)..."
                  className="w-full py-3 px-4 rounded-xl bg-background-secondary border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-lavender transition-colors text-sm"
                />
                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-lavender text-white font-medium disabled:opacity-50"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isSubmitting ? "Submitting..." : "Check In"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* My check-in - shown after checking in */}
      {hasCheckedIn && myCheckIn && (
        <div className="p-3 rounded-xl bg-sky/10 border border-sky/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getMoodEmoji(myCheckIn.mood)}</span>
            <div>
              <p className="text-xs text-sky">Your mood</p>
              {myCheckIn.note && (
                <p className="text-sm text-foreground">{myCheckIn.note}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      {(hasCheckedIn || partnerHasCheckedIn) && (
        <div className="border-t border-border" />
      )}

      {/* Partner's check-in */}
      {partnerHasCheckedIn && partnerCheckIn ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-rose/10 border border-rose/30"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getMoodEmoji(partnerCheckIn.mood)}</span>
            <div className="flex-1">
              <p className="text-xs text-rose">
                {partner?.name} • today
              </p>
              {partnerCheckIn.note && (
                <p className="text-sm text-foreground">{partnerCheckIn.note}</p>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <p className="text-sm text-foreground-muted text-center">
          {partner?.name} hasn&apos;t checked in yet
        </p>
      )}
    </motion.div>
  );
}
