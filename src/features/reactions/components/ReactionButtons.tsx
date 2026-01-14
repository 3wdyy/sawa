"use client";

import { motion } from "framer-motion";
import { useReactions } from "../hooks/useReactions";

interface ReactionButtonsProps {
  targetType: string;
  targetId: string;
  disabled?: boolean;
}

/**
 * Reaction buttons (heart/celebrate) for partner completions
 * +5 XP for each reaction sent
 */
export function ReactionButtons({
  targetType,
  targetId,
  disabled = false,
}: ReactionButtonsProps) {
  const { sendHeart, sendCelebrate, isReacting } = useReactions();

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={() => sendHeart(targetType, targetId)}
        disabled={disabled || isReacting}
        className="p-2 rounded-lg bg-rose/10 border border-rose/30 hover:bg-rose/20 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Send love"
      >
        <span className="text-lg">❤️</span>
      </motion.button>
      <motion.button
        onClick={() => sendCelebrate(targetType, targetId)}
        disabled={disabled || isReacting}
        className="p-2 rounded-lg bg-gold/10 border border-gold/30 hover:bg-gold/20 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Celebrate"
      >
        <span className="text-lg">🎉</span>
      </motion.button>
      {!disabled && (
        <span className="text-xs text-foreground-muted">+5 XP</span>
      )}
    </div>
  );
}
