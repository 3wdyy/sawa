"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRitual } from "../hooks/useRitual";
import { useAuth } from "@/features/auth/context";
import type { MoodType } from "@/types/database";

const MOOD_OPTIONS: { mood: MoodType; emoji: string }[] = [
  { mood: "great", emoji: "😊" },
  { mood: "okay", emoji: "😐" },
  { mood: "low", emoji: "😔" },
  { mood: "tired", emoji: "😴" },
  { mood: "stressed", emoji: "😤" },
];

const VIBE_OPTIONS = [
  { vibe: "وحشتني 💕", label: "وحشتني", emoji: "💕" },
  { vibe: "بحبك ❤️", label: "بحبك", emoji: "❤️" },
  { vibe: "بفكر فيك 💭", label: "بفكر فيك", emoji: "💭" },
  { vibe: "مشتاق/ة 🥺", label: "مشتاق/ة", emoji: "🥺" },
];

const ENERGY_LEVELS = [1, 2, 3, 4, 5];

function getMoodEmoji(mood: MoodType | null): string {
  return MOOD_OPTIONS.find((o) => o.mood === mood)?.emoji || "😐";
}

/**
 * Quick Ritual Card - 3-tap flow: mood → energy → vibe
 */
export function QuickRitualCard() {
  const { partner } = useAuth();
  const {
    myRitual,
    partnerRitual,
    hasCompleted,
    partnerHasCompleted,
    isLoading,
    complete,
    isSubmitting,
  } = useRitual();

  // Local state for the 3 steps
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  const [customVibe, setCustomVibe] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (isLoading) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-background-secondary rounded w-1/3 mb-3" />
        <div className="h-12 bg-background-secondary rounded w-full" />
      </div>
    );
  }

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setStep(2);
  };

  const handleEnergySelect = (energy: number) => {
    setSelectedEnergy(energy);
    setStep(3);
  };

  const handleVibeSelect = (vibe: string) => {
    if (!selectedMood || !selectedEnergy) return;
    complete(selectedMood, selectedEnergy, vibe);
  };

  const handleCustomVibeSubmit = () => {
    if (!customVibe.trim() || !selectedMood || !selectedEnergy) return;
    complete(selectedMood, selectedEnergy, customVibe.trim());
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
          <span>✨</span> الطقوس اليومية
        </span>
        {hasCompleted && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-mint/20 text-mint">
            +15 XP
          </span>
        )}
      </div>

      {/* Not completed - show steps */}
      {!hasCompleted && (
        <AnimatePresence mode="wait">
          {/* Step 1: Mood */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <p className="text-sm text-foreground-muted">
                <span className="text-lavender font-medium">1/3</span> مزاجك دلوقتي إيه؟
              </p>
              <div className="flex gap-2">
                {MOOD_OPTIONS.map(({ mood, emoji }) => (
                  <motion.button
                    key={mood}
                    onClick={() => handleMoodSelect(mood)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-background-secondary border border-border hover:border-lavender transition-all text-2xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Energy */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground-muted">
                  <span className="text-lavender font-medium">2/3</span> معدل طاقتك؟
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-foreground-muted hover:text-foreground"
                >
                  ← رجوع
                </button>
              </div>
              <div className="flex gap-2">
                {ENERGY_LEVELS.map((level) => (
                  <motion.button
                    key={level}
                    onClick={() => handleEnergySelect(level)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-background-secondary border border-border hover:border-lavender transition-all font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {level}
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-center text-foreground-muted">
                🔋 Low → High ⚡
              </p>
            </motion.div>
          )}

          {/* Step 3: Vibe */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground-muted" dir="rtl">
                  <span className="text-lavender font-medium">3/3</span> ابعت vibe لـ <bdi>{partner?.name}</bdi>
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-foreground-muted hover:text-foreground"
                >
                  رجوع →
                </button>
              </div>

              {!showCustomInput ? (
                <div className="grid grid-cols-2 gap-2">
                  {VIBE_OPTIONS.map(({ vibe, label, emoji }) => (
                    <motion.button
                      key={vibe}
                      onClick={() => handleVibeSelect(vibe)}
                      disabled={isSubmitting}
                      className="py-3 px-2 rounded-xl bg-background-secondary border border-border hover:border-rose transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg mr-1">{emoji}</span>
                      <span className="text-sm">{label}</span>
                    </motion.button>
                  ))}
                  <motion.button
                    onClick={() => setShowCustomInput(true)}
                    className="py-3 px-2 rounded-xl bg-background-secondary border border-border hover:border-lavender transition-all text-sm text-foreground-muted"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ✏️ حاجة تانية...
                  </motion.button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customVibe}
                    onChange={(e) => setCustomVibe(e.target.value.slice(0, 50))}
                    placeholder="اكتب الـ vibe بتاعك..."
                    className="flex-1 py-3 px-4 rounded-xl bg-background-secondary border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-lavender transition-colors text-sm text-right"
                    dir="rtl"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleCustomVibeSubmit()}
                  />
                  <motion.button
                    onClick={handleCustomVibeSubmit}
                    disabled={!customVibe.trim() || isSubmitting}
                    className="py-3 px-4 rounded-xl bg-rose text-white font-medium disabled:opacity-50"
                    whileTap={{ scale: 0.98 }}
                  >
                    ابعت
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Completed - show summary */}
      {hasCompleted && myRitual && (
        <div className="p-3 rounded-xl bg-sky/10 border border-sky/30">
          <p className="text-xs text-sky mb-2">الطقوس بتاعتك</p>
          <div className="flex items-center gap-4 text-sm">
            <span title="Mood">{getMoodEmoji(myRitual.mood)}</span>
            <span title="Energy" className="text-foreground-muted">
              🔋 {myRitual.energy}/5
            </span>
            <span className="text-foreground" dir="rtl">{myRitual.vibe}</span>
          </div>
        </div>
      )}

      {/* Divider */}
      {(hasCompleted || partnerHasCompleted) && (
        <div className="border-t border-border" />
      )}

      {/* Partner's ritual */}
      {partnerHasCompleted && partnerRitual ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-rose/10 border border-rose/30"
        >
          <p className="text-xs text-rose mb-2" dir="rtl">طقوس <bdi>{partner?.name}</bdi></p>
          <div className="flex items-center gap-4 text-sm">
            <span title="Mood">{getMoodEmoji(partnerRitual.mood)}</span>
            <span title="Energy" className="text-foreground-muted">
              🔋 {partnerRitual.energy}/5
            </span>
            <span className="text-foreground" dir="rtl">{partnerRitual.vibe}</span>
          </div>
        </motion.div>
      ) : (
        <p className="text-sm text-foreground-muted text-center" dir="rtl">
          <bdi>{partner?.name}</bdi> لسه ما عملش الطقوس
        </p>
      )}
    </motion.div>
  );
}
