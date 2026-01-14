"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/context";
import { useWishes } from "../hooks/useWishes";
import type { Wish } from "@/types/database";

type Tab = "mine" | "partner" | "archive";

/**
 * Wish List Card - each person adds things they'd love
 * Partner sees for gift/date ideas
 */
export function WishListCard() {
  const { user, partner } = useAuth();
  const {
    myUnfulfilled,
    myFulfilled,
    partnerUnfulfilled,
    partnerFulfilled,
    isLoading,
    add,
    fulfill,
    remove,
    isAdding,
  } = useWishes();

  const [activeTab, setActiveTab] = useState<Tab>("mine");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showArchive, setShowArchive] = useState(false);

  if (isLoading) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-background-secondary rounded w-1/3 mb-3" />
        <div className="flex gap-2 mb-4">
          {[1, 2].map((i) => (
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

  const isAhmad = user?.slug === "ahmad";

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    add(newTitle.trim());
    setNewTitle("");
    setIsAddingNew(false);
  };

  const activeWishes =
    activeTab === "mine"
      ? myUnfulfilled
      : activeTab === "partner"
      ? partnerUnfulfilled
      : [];

  const archivedWishes = [...myFulfilled, ...partnerFulfilled];

  return (
    <motion.div
      className="card card-glow p-4 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-lavender flex items-center gap-2">
          <span>🌟</span> أمنيات
        </span>
        {activeTab === "mine" && (
          <motion.button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="text-xs px-3 py-1.5 rounded-full bg-lavender/20 text-lavender hover:bg-lavender/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAddingNew ? "إلغاء" : "+ أضف"}
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <motion.button
          onClick={() => setActiveTab("mine")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors ${
            activeTab === "mine"
              ? isAhmad
                ? "bg-sky/20 text-sky border border-sky/30"
                : "bg-rose/20 text-rose border border-rose/30"
              : "bg-background-secondary text-foreground-muted border border-border hover:border-lavender/30"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="ml-1">✨</span>
          أمنياتي
          {myUnfulfilled.length > 0 && (
            <span className="ml-1 opacity-60">({myUnfulfilled.length})</span>
          )}
        </motion.button>
        <motion.button
          onClick={() => setActiveTab("partner")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors ${
            activeTab === "partner"
              ? !isAhmad
                ? "bg-sky/20 text-sky border border-sky/30"
                : "bg-rose/20 text-rose border border-rose/30"
              : "bg-background-secondary text-foreground-muted border border-border hover:border-lavender/30"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="ml-1">🎁</span>
          أمنيات <bdi>{partner?.name}</bdi>
          {partnerUnfulfilled.length > 0 && (
            <span className="ml-1 opacity-60">({partnerUnfulfilled.length})</span>
          )}
        </motion.button>
      </div>

      {/* Add new wish form */}
      <AnimatePresence>
        {isAddingNew && activeTab === "mine" && (
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
              placeholder="حاجة نفسي فيها..."
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
              أضف
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wishes list */}
      {activeWishes.length === 0 ? (
        <p className="text-sm text-foreground-muted text-center py-4" dir="rtl">
          {activeTab === "mine"
            ? "أضف حاجات نفسك فيها!"
            : <><bdi>{partner?.name}</bdi> لسه ما ضافش أمنيات</>}
        </p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <AnimatePresence initial={false}>
            {activeWishes.map((wish) => (
              <WishItem
                key={wish.id}
                wish={wish}
                isMine={activeTab === "mine"}
                isAhmad={isAhmad}
                onFulfill={fulfill}
                onDelete={remove}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Archive toggle */}
      {archivedWishes.length > 0 && (
        <div>
          <motion.button
            onClick={() => setShowArchive(!showArchive)}
            className="text-xs text-foreground-muted hover:text-lavender transition-colors flex items-center gap-1"
            whileHover={{ x: 2 }}
          >
            <span className="transform transition-transform duration-200" style={{ rotate: showArchive ? "90deg" : "0deg" }}>
              ▶
            </span>
            <span>متحققة ({archivedWishes.length})</span>
          </motion.button>
          <AnimatePresence>
            {showArchive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2 max-h-32 overflow-y-auto"
              >
                {archivedWishes.map((wish) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-2 rounded-lg bg-mint/5 border border-mint/20 flex items-center gap-2"
                  >
                    <span className="text-mint">✓</span>
                    <span className="text-sm text-foreground-muted line-through flex-1" dir="rtl">
                      {wish.title}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Individual wish item
 */
function WishItem({
  wish,
  isMine,
  isAhmad,
  onFulfill,
  onDelete,
}: {
  wish: Wish;
  isMine: boolean;
  isAhmad: boolean;
  onFulfill: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
        isMine
          ? isAhmad
            ? "bg-sky/5 border-sky/20"
            : "bg-rose/5 border-rose/20"
          : !isAhmad
          ? "bg-sky/5 border-sky/20"
          : "bg-rose/5 border-rose/20"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground" dir="rtl">{wish.title}</p>
        {wish.description && (
          <p className="text-xs text-foreground-muted truncate" dir="rtl">
            {wish.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Fulfill button (for my wishes) */}
        {isMine && (
          <motion.button
            onClick={() => onFulfill(wish.id)}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-mint hover:bg-mint/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Mark as fulfilled"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.button>
        )}

        {/* Delete button (for my wishes only) */}
        {isMine && (
          <motion.button
            onClick={() => onDelete(wish.id)}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-rose hover:bg-rose/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Delete wish"
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
        )}
      </div>
    </motion.div>
  );
}
