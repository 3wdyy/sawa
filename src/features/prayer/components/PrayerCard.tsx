"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { PRAYER_NAMES, PRAYER_DISPLAY_NAMES } from "@/lib/constants";
import type { PrayerName } from "@/types/database";

interface PrayerStatus {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

interface PrayerCardProps {
  userName: string;
  userEmoji: string;
  prayerStatus: PrayerStatus;
  partnerPrayerStatus?: PrayerStatus;
  currentPrayer?: PrayerName | null;
  onTogglePrayer: (prayer: PrayerName) => Promise<void>;
  isOwner: boolean; // Can this user toggle prayers?
  color: "ahmad" | "reem";
}

const prayerColors: Record<PrayerName, string> = {
  fajr: "bg-lavender/20 text-lavender border-lavender/30",
  dhuhr: "bg-gold/20 text-gold border-gold/30",
  asr: "bg-peach/20 text-peach border-peach/30",
  maghrib: "bg-rose/20 text-rose border-rose/30",
  isha: "bg-sky/20 text-sky border-sky/30",
};

const prayerCompletedColors: Record<PrayerName, string> = {
  fajr: "bg-lavender text-background",
  dhuhr: "bg-gold text-background",
  asr: "bg-peach text-background",
  maghrib: "bg-rose text-background",
  isha: "bg-sky text-background",
};

export function PrayerCard({
  userName,
  userEmoji,
  prayerStatus,
  partnerPrayerStatus,
  currentPrayer,
  onTogglePrayer,
  isOwner,
  color,
}: PrayerCardProps) {
  const completedCount = Object.values(prayerStatus).filter(Boolean).length;
  const isAllCompleted = completedCount === 5;

  return (
    <motion.div
      className={cn(
        "relative p-4 rounded-2xl border border-border",
        isAllCompleted
          ? "bg-mint/10 border-mint/30"
          : "bg-background-secondary"
      )}
      layout
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full text-xl",
            color === "ahmad" ? "bg-sky/20" : "bg-rose/20"
          )}
          animate={isAllCompleted ? { scale: [1, 1.1, 1] } : {}}
        >
          {userEmoji}
        </motion.div>
        <div className="flex-1">
          <h3 className="font-medium" dir="rtl">صلوات <bdi>{userName}</bdi></h3>
          <p className="text-sm text-foreground-muted" dir="rtl">
            {completedCount}/5 مكتملة
          </p>
        </div>

        {/* All done celebration */}
        <AnimatePresence>
          {isAllCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-2xl"
            >
              🌟
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prayer buttons */}
      <div className="grid grid-cols-5 gap-2">
        {PRAYER_NAMES.map((prayer) => {
          const isCompleted = prayerStatus[prayer];
          const isPartnerCompleted = partnerPrayerStatus?.[prayer];
          const isCurrent = currentPrayer === prayer;

          return (
            <motion.button
              key={prayer}
              onClick={() => isOwner && onTogglePrayer(prayer)}
              disabled={!isOwner}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all",
                "disabled:cursor-default",
                isCompleted
                  ? prayerCompletedColors[prayer]
                  : prayerColors[prayer],
                isCurrent && !isCompleted && "ring-2 ring-offset-2 ring-offset-background ring-current"
              )}
              whileHover={isOwner ? { scale: 1.05 } : {}}
              whileTap={isOwner ? { scale: 0.95 } : {}}
              layout
            >
              {/* Partner indicator */}
              <AnimatePresence>
                {isPartnerCompleted && !isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-rose rounded-full border border-background"
                  />
                )}
              </AnimatePresence>

              <span className="text-lg mb-0.5">🕌</span>
              <span className="text-[10px] font-medium">
                {PRAYER_DISPLAY_NAMES[prayer]}
              </span>

              {/* Checkmark overlay */}
              <AnimatePresence>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-background-tertiary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-mint rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / 5) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </motion.div>
  );
}
