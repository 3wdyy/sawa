"use client";

import { motion } from "framer-motion";
import { useDailyQuote } from "../hooks/useDailyQuote";

/**
 * Daily Quote Card - displays one inspiring quote per day
 * Positioned at top of dashboard below progress bar
 */
export function DailyQuoteCard() {
  const { quote, isLoading } = useDailyQuote();

  if (isLoading) {
    return (
      <motion.div
        className="p-4 rounded-2xl bg-gradient-to-r from-lavender/5 via-lavender/10 to-lavender/5 border border-lavender/20 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="h-4 bg-lavender/20 rounded w-3/4 mx-auto" />
      </motion.div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <motion.div
      className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-lavender/5 via-lavender/10 to-lavender/5 border border-lavender/20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Decorative quotation mark */}
      <motion.span
        className="absolute -top-2 -left-1 text-5xl text-lavender/10 font-serif select-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        &ldquo;
      </motion.span>

      {/* Quote text */}
      <motion.p
        className="text-sm text-center text-foreground/90 italic leading-relaxed px-4"
        dir="rtl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {quote.quote}
      </motion.p>

      {/* Source */}
      {quote.source && (
        <motion.p
          className="text-xs text-center text-lavender mt-2"
          dir="rtl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          — {quote.source}
        </motion.p>
      )}

      {/* Decorative closing quotation mark */}
      <motion.span
        className="absolute -bottom-4 -right-1 text-5xl text-lavender/10 font-serif select-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        &rdquo;
      </motion.span>
    </motion.div>
  );
}
