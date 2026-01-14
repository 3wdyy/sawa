"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme, THEMES } from "../context";

/**
 * Theme Toggle - tap to open picker, tap theme to select
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="relative">
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="تغيير الألوان"
      >
        <span className="text-lg">{currentTheme.emoji}</span>
      </motion.button>

      {/* Theme picker dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Picker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute left-0 top-full mt-2 z-50 p-2 rounded-xl bg-background-secondary border border-border shadow-lg min-w-[140px]"
            >
              <p className="text-xs text-foreground-muted px-2 py-1 mb-1" dir="rtl">
                الألوان
              </p>
              {THEMES.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    theme === t.id
                      ? "bg-lavender/20 text-lavender"
                      : "text-foreground hover:bg-background-tertiary"
                  }`}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{t.emoji}</span>
                  <span dir="rtl">{t.name}</span>
                  {theme === t.id && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto text-xs"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
