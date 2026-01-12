"use client";

import { motion } from "framer-motion";
import { useAuth } from "../context";
import { Avatar } from "@/components/ui/avatar";

const users = [
  { slug: "ahmad", name: "Ahmad", emoji: "👨🏻", color: "ahmad" as const },
  { slug: "reem", name: "Reem", emoji: "👩🏻", color: "reem" as const },
];

export function UserSelect() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-6xl font-bold gradient-text mb-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          سوا
        </motion.h1>
        <motion.p
          className="text-foreground-muted text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Together
        </motion.p>
      </motion.div>

      {/* User selection */}
      <motion.div
        className="flex flex-col gap-4 w-full max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-center text-foreground-muted mb-2">Who are you?</p>

        <div className="flex gap-4 justify-center">
          {users.map((user, index) => (
            <motion.button
              key={user.slug}
              onClick={() => login(user.slug)}
              disabled={isLoading}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-background-secondary border border-border hover:border-lavender/50 transition-colors disabled:opacity-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Avatar
                emoji={user.emoji}
                name={user.name}
                size="xl"
                color={user.color}
                showRing
              />
              <span className="font-medium text-lg">{user.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="absolute bottom-8 text-sm text-foreground-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Made with 💕 for us
      </motion.p>
    </div>
  );
}
