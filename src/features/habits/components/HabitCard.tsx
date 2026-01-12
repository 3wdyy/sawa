"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { Habit, HabitLog } from "@/types/database";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  isPartnerCompleted?: boolean;
  log?: HabitLog | null;
  onToggle: () => Promise<void>;
  disabled?: boolean;
}

export function HabitCard({
  habit,
  isCompleted,
  isPartnerCompleted = false,
  log,
  onToggle,
  disabled = false,
}: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    try {
      await onToggle();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      disabled={disabled || isLoading}
      className={cn(
        "relative w-full p-4 rounded-2xl text-left transition-all",
        "border border-border",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isCompleted
          ? "bg-mint/10 border-mint/30"
          : "bg-background-secondary hover:bg-background-tertiary"
      )}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      layout
    >
      {/* Partner completed indicator */}
      <AnimatePresence>
        {isPartnerCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose rounded-full border-2 border-background flex items-center justify-center"
          >
            <span className="text-[8px]">💕</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        {/* Icon with completion state */}
        <motion.div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl text-2xl",
            isCompleted ? "bg-mint/20" : "bg-background-tertiary"
          )}
          animate={isCompleted ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <motion.div
              className="w-5 h-5 border-2 border-mint border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <span>{habit.icon}</span>
          )}
        </motion.div>

        {/* Habit info */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-medium truncate",
              isCompleted ? "text-mint" : "text-foreground"
            )}
          >
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-foreground-muted truncate">
              {habit.description}
            </p>
          )}
        </div>

        {/* Checkmark */}
        <AnimatePresence mode="wait">
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-mint text-background"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion celebration effect */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(134, 239, 172, 0.1) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
