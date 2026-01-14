"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDailyQuestion } from "../hooks/useDailyQuestion";
import { useAuth } from "@/features/auth/context";

/**
 * Daily Question Card - tap-based UI with unlock mechanic
 */
export function DailyQuestionCard() {
  const { partner } = useAuth();
  const {
    question,
    options,
    myResponse,
    partnerResponse,
    hasAnswered,
    partnerHasAnswered,
    canSeePartnerAnswer,
    canShuffle,
    isLoading,
    submitAnswer,
    shuffle,
    isSubmitting,
    isShuffling,
  } = useDailyQuestion();

  const [textAnswer, setTextAnswer] = useState("");

  if (isLoading) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-background-secondary rounded w-1/4 mb-3" />
        <div className="h-6 bg-background-secondary rounded w-3/4 mb-4" />
        <div className="flex gap-2">
          <div className="h-10 bg-background-secondary rounded flex-1" />
          <div className="h-10 bg-background-secondary rounded flex-1" />
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  const questionType = question.question_type;
  const isTextType = questionType === "one_word" || questionType === "fill_blank";

  const handleOptionClick = (option: string) => {
    if (hasAnswered || isSubmitting) return;
    submitAnswer(option);
  };

  const handleTextSubmit = () => {
    if (!textAnswer.trim() || hasAnswered || isSubmitting) return;
    submitAnswer(textAnswer.trim());
    setTextAnswer("");
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
          <span>❓</span> Daily Question
        </span>
        {hasAnswered && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-mint/20 text-mint">
            +25 XP
          </span>
        )}
      </div>

      {/* Question text */}
      <p className="text-lg font-medium text-foreground">
        {question.question}
      </p>

      {/* Answer options - tap based */}
      {!isTextType && options && !hasAnswered && (
        <div className="flex flex-wrap gap-2">
          {options.map((option, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleOptionClick(option)}
              disabled={isSubmitting}
              className="flex-1 min-w-[80px] py-3 px-4 rounded-xl bg-background-secondary border border-border text-foreground hover:border-lavender hover:bg-lavender/10 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option}
            </motion.button>
          ))}
        </div>
      )}

      {/* Text input for one_word / fill_blank */}
      {isTextType && !hasAnswered && (
        <div className="flex gap-2">
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value.slice(0, questionType === "one_word" ? 20 : 50))}
            placeholder={questionType === "one_word" ? "One word..." : "Your answer..."}
            className="flex-1 py-3 px-4 rounded-xl bg-background-secondary border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-lavender transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
          />
          <motion.button
            onClick={handleTextSubmit}
            disabled={!textAnswer.trim() || isSubmitting}
            className="py-3 px-6 rounded-xl bg-lavender text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send
          </motion.button>
        </div>
      )}

      {/* My answer - shown after answering */}
      {hasAnswered && myResponse && (
        <div className="p-3 rounded-xl bg-sky/10 border border-sky/30">
          <p className="text-xs text-sky mb-1">Your answer</p>
          <p className="text-foreground font-medium">{myResponse.answer}</p>
        </div>
      )}

      {/* Partner's answer - locked until user answers */}
      <AnimatePresence mode="wait">
        {!hasAnswered && (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-foreground-muted"
          >
            <span className="text-lg">🔒</span>
            <span>{partner?.name}&apos;s answer unlocks after yours</span>
          </motion.div>
        )}

        {hasAnswered && !partnerHasAnswered && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-foreground-muted"
          >
            <span className="text-lg">⏳</span>
            <span>Waiting for {partner?.name} to answer...</span>
          </motion.div>
        )}

        {canSeePartnerAnswer && partnerResponse && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-rose/10 border border-rose/30"
          >
            <p className="text-xs text-rose mb-1">{partner?.name}&apos;s answer</p>
            <p className="text-foreground font-medium">{partnerResponse.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shuffle button */}
      {canShuffle && (
        <motion.button
          onClick={() => shuffle()}
          disabled={isShuffling}
          className="w-full py-2 text-sm text-foreground-muted hover:text-foreground flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          whileTap={{ scale: 0.98 }}
        >
          <span>🔄</span>
          <span>Shuffle - 1 left today</span>
        </motion.button>
      )}
    </motion.div>
  );
}
