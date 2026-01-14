"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/context";
import {
  useActivityFeed,
  getActivityDisplay,
  formatActivityTime,
} from "../hooks/useActivityFeed";
import { ReactionButtons } from "@/features/reactions/components/ReactionButtons";

/**
 * Activity Feed Card - shows recent actions from both users in real-time
 */
export function ActivityFeedCard() {
  const { user, partner } = useAuth();
  const { activities, isLoading } = useActivityFeed();

  if (isLoading) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-background-secondary rounded w-1/3 mb-3" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-background-secondary rounded" />
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
          <span>📡</span> Activity
        </span>
        <span className="text-xs text-foreground-muted">Live</span>
      </div>

      {/* Activity list */}
      {activities.length === 0 ? (
        <p className="text-sm text-foreground-muted text-center py-4">
          No activity yet today
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <AnimatePresence initial={false}>
            {activities.map((activity, index) => {
              const { emoji, text } = getActivityDisplay(activity);
              const isPartner = activity.user_id === partner?.id;
              const isMe = activity.user_id === user?.id;
              const userName = isPartner
                ? partner?.name
                : isMe
                ? "You"
                : "Someone";

              // Can react to partner's completions (not reactions, not your own)
              const canReact =
                isPartner &&
                activity.activity !== "reaction_sent" &&
                activity.target_id;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-xl border ${
                    isPartner
                      ? "bg-rose/5 border-rose/20"
                      : isMe
                      ? "bg-sky/5 border-sky/20"
                      : "bg-background-secondary border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-lg flex-shrink-0">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          <span
                            className={
                              isPartner
                                ? "text-rose font-medium"
                                : isMe
                                ? "text-sky font-medium"
                                : ""
                            }
                          >
                            {userName}
                          </span>{" "}
                          {text}
                        </p>
                        <p className="text-xs text-foreground-muted">
                          {formatActivityTime(activity.created_at)}
                          {activity.xp_earned && activity.xp_earned > 0 && (
                            <span className="ml-2 text-mint">
                              +{activity.xp_earned} XP
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Reaction buttons for partner activities */}
                    {canReact && (
                      <ReactionButtons
                        targetType={activity.activity}
                        targetId={activity.target_id!}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
