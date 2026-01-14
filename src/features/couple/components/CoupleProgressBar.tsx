"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoupleProgress } from "../hooks/useCoupleProgress";
import { cn } from "@/lib/utils/cn";

// Pre-computed particle positions for XP gain animation
const PARTICLE_OFFSETS = [
  { x: 35, y: -25 },
  { x: -20, y: -35 },
  { x: 45, y: -15 },
  { x: -35, y: -45 },
  { x: 10, y: -30 },
];

interface CoupleProgressBarProps {
  className?: string;
  showXpGain?: number; // Temporarily show XP gain animation
}

export function CoupleProgressBar({ className, showXpGain }: CoupleProgressBarProps) {
  const { level, totalXp, progressPercent, xpToNextLevel, isLoading } = useCoupleProgress();

  // Memoize particle positions to avoid re-renders
  const particlePositions = useMemo(() => PARTICLE_OFFSETS, []);

  if (isLoading) {
    return (
      <div className={cn("p-4 rounded-2xl bg-background-secondary border border-border", className)}>
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-background-tertiary" />
          <div className="flex-1">
            <div className="h-3 bg-background-tertiary rounded w-24 mb-2" />
            <div className="h-2 bg-background-tertiary rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative p-4 rounded-2xl bg-background-secondary border border-border overflow-hidden",
        className
      )}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, var(--gold-glow), transparent 70%)",
        }}
      />

      <div className="relative flex items-center gap-4">
        {/* Level badge */}
        <motion.div
          className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-gold/20 border border-gold/30"
          whileHover={{ scale: 1.05 }}
          animate={showXpGain ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <span className="text-2xl font-bold text-gold">{level}</span>
          {/* Level up celebration */}
          <AnimatePresence>
            {showXpGain && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 rounded-xl border-2 border-gold"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress section */}
        <div className="flex-1 min-w-0">
          {/* Header with level and XP */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Level {level}</span>
            <div className="flex items-center gap-1">
              <AnimatePresence mode="popLayout">
                {showXpGain && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                    className="text-sm font-bold text-gold"
                  >
                    +{showXpGain}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-sm text-foreground-muted">
                {totalXp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-background-tertiary rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, var(--gold) 0%, var(--gold-soft) 100%)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
            {/* Shine effect */}
            <motion.div
              className="absolute inset-y-0 w-8"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
              animate={{
                left: ["-10%", "110%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          </div>

          {/* XP to next level */}
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-foreground-muted" dir="rtl">
              {xpToNextLevel - totalXp > 0
                ? `${(xpToNextLevel - totalXp).toLocaleString()} XP للمستوى الجاي`
                : "جاهز للمستوى الجاي!"}
            </span>
            <span className="text-xs text-gold font-medium">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* XP gain animation particles */}
      <AnimatePresence>
        {showXpGain && (
          <>
            {particlePositions.map((offset, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gold"
                initial={{
                  x: 60,
                  y: 30,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: 60 + offset.x,
                  y: 30 + offset.y,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
