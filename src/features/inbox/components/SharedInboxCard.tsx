"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/context";
import { useInbox, INBOX_CATEGORIES } from "../hooks/useInbox";
import type { InboxCategory } from "@/types/database";

/**
 * Shared Inbox Card - categorized shared space for ideas, todos, dreams, memories
 */
export function SharedInboxCard() {
  const { user, partner } = useAuth();
  const { itemsByCategory, isLoading, add, complete, remove, isAdding } =
    useInbox();

  const [activeCategory, setActiveCategory] = useState<InboxCategory>("idea");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  if (isLoading) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-background-secondary rounded w-1/3 mb-3" />
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-background-secondary rounded flex-1" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-background-secondary rounded" />
          ))}
        </div>
      </div>
    );
  }

  const activeItems = itemsByCategory[activeCategory] || [];
  const activeInfo = INBOX_CATEGORIES.find((c) => c.id === activeCategory)!;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    add(activeCategory, newTitle.trim());
    setNewTitle("");
    setIsAddingNew(false);
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
          <span>📥</span> Our Inbox
        </span>
        <motion.button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="text-xs px-3 py-1.5 rounded-full bg-lavender/20 text-lavender hover:bg-lavender/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAddingNew ? "Cancel" : "+ Add"}
        </motion.button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2">
        {INBOX_CATEGORIES.map(({ id, emoji, label }) => {
          const count = itemsByCategory[id]?.filter((i) => !i.completed).length || 0;
          const isActive = activeCategory === id;

          return (
            <motion.button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? "bg-lavender/20 text-lavender border border-lavender/30"
                  : "bg-background-secondary text-foreground-muted border border-border hover:border-lavender/30"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-1">{emoji}</span>
              {label}
              {count > 0 && (
                <span className="ml-1 opacity-60">({count})</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Add new item form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={`أضف لـ ${activeInfo.label}...`}
              className="flex-1 py-2 px-3 rounded-xl bg-background-secondary border border-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-lavender transition-colors text-sm text-right"
              dir="rtl"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
            />
            <motion.button
              onClick={handleAdd}
              disabled={!newTitle.trim() || isAdding}
              className="py-2 px-4 rounded-xl bg-lavender text-white font-medium text-sm disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items list */}
      {activeItems.length === 0 ? (
        <p className="text-sm text-foreground-muted text-center py-4">
          No {activeInfo.label.toLowerCase()} yet
        </p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <AnimatePresence initial={false}>
            {activeItems
              .filter((item) => activeCategory !== "todo" || !item.completed)
              .map((item) => {
                const isPartner = item.added_by === partner?.id;
                const isMe = item.added_by === user?.id;
                const addedBy = isPartner ? partner?.name : isMe ? "You" : "";

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                      isPartner
                        ? "bg-rose/5 border-rose/20"
                        : "bg-sky/5 border-sky/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {activeCategory === "todo" && (
                        <motion.button
                          onClick={() => complete(item.id)}
                          className="w-5 h-5 rounded border-2 border-foreground-muted hover:border-mint flex items-center justify-center transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {item.completed && (
                            <span className="text-mint text-xs">✓</span>
                          )}
                        </motion.button>
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            item.completed
                              ? "text-foreground-muted line-through"
                              : "text-foreground"
                          }`}
                          dir="rtl"
                        >
                          {item.title}
                        </p>
                        <p className="text-xs text-foreground-muted">
                          {addedBy && (
                            <span
                              className={
                                isPartner ? "text-rose" : "text-sky"
                              }
                            >
                              {addedBy}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Delete button */}
                    <motion.button
                      onClick={() => remove(item.id)}
                      className="p-1.5 rounded-lg text-foreground-muted hover:text-rose hover:bg-rose/10 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
