"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuests } from "../hooks/useQuests";

/**
 * Quest Card - daily/weekly challenges with variable XP rewards
 */
export function QuestsCard() {
  const {
    quests,
    isLoading,
    complete,
    isCompleting,
    completedCount,
    totalCount,
    totalXpAvailable,
  } = useQuests();

  if (isLoading) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-background-secondary rounded w-1/3 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-background-secondary rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="card p-4 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-lavender flex items-center gap-2">
          <span>🏆</span> مهام يومية
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground-muted">
            {completedCount}/{totalCount}
          </span>
          {totalXpAvailable > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold">
              {totalXpAvailable} XP باقي
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-lavender to-mint"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Quest list */}
      {quests.length === 0 ? (
        <p className="text-sm text-foreground-muted text-center py-4" dir="rtl">
          مفيش مهام النهارده
        </p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {quests.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  quest.isCompleted
                    ? "bg-mint/10 border-mint/30"
                    : "bg-background-secondary border-border"
                }`}
              >
                {/* Quest info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      quest.isCompleted
                        ? "bg-mint/20 text-mint"
                        : "bg-gold/10 text-gold"
                    }`}
                    animate={
                      quest.isCompleted
                        ? { scale: [1, 1.2, 1] }
                        : {}
                    }
                  >
                    {quest.isCompleted ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm">🎯</span>
                    )}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        quest.isCompleted
                          ? "text-mint line-through"
                          : "text-foreground"
                      }`}
                    >
                      {quest.title}
                    </p>
                    {quest.description && (
                      <p className="text-xs text-foreground-muted truncate">
                        {quest.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* XP reward / Complete button */}
                {quest.isCompleted ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-mint/20 text-mint">
                    +{quest.xp_reward} XP
                  </span>
                ) : (
                  <motion.button
                    onClick={() => complete(quest)}
                    disabled={isCompleting}
                    className="px-3 py-1.5 rounded-lg bg-gold/20 text-gold text-xs font-medium hover:bg-gold/30 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    احصل +{quest.xp_reward}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* All complete message */}
      {completedCount === totalCount && totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-2"
        >
          <span className="text-2xl">🎉</span>
          <p className="text-sm text-mint font-medium mt-1" dir="rtl">
            خلصت كل المهام!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
