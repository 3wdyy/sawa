"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/context";
import { UserSelect } from "@/features/auth/components/UserSelect";
import { Avatar } from "@/components/ui/avatar";
import { HabitCard } from "@/features/habits/components/HabitCard";
import { PrayerCard } from "@/features/prayer/components/PrayerCard";
import { CoupleProgressBar } from "@/features/couple/components/CoupleProgressBar";
import { DailyQuestionCard } from "@/features/questions/components/DailyQuestionCard";
import { CheckInCard } from "@/features/checkin/components/CheckInCard";
import { QuickRitualCard } from "@/features/ritual/components/QuickRitualCard";
import { ActivityFeedCard } from "@/features/activity/components/ActivityFeedCard";
import { SharedInboxCard } from "@/features/inbox/components/SharedInboxCard";
import { QuestsCard } from "@/features/quests/components/QuestsCard";
import { DailyQuoteCard } from "@/features/quotes/components/DailyQuoteCard";
import { WishListCard } from "@/features/wishes/components/WishListCard";
import { useHabits } from "@/features/habits/hooks/useHabits";
import { usePartnerHabits } from "@/features/habits/hooks/usePartnerHabits";
import { usePrayerTimes } from "@/features/prayer/hooks/usePrayerTimes";
import type { PrayerName } from "@/types/database";

export default function Home() {
  const { user, partner, isLoading: authLoading, logout } = useAuth();

  // Fetch habits from Supabase
  const {
    habits: myHabits,
    isLoading: habitsLoading,
    toggleHabit,
  } = useHabits();

  const { habits: partnerHabitsData } = usePartnerHabits();

  // Fetch prayer times from Aladhan API
  const {
    currentPrayer,
    isLoading: prayerTimesLoading,
  } = usePrayerTimes({
    city: user?.city || "Dubai",
    country: user?.country || "AE",
    timezone: user?.timezone || "Asia/Dubai",
  });

  // Separate prayers from other habits
  const { prayerHabits, otherHabits } = useMemo(() => {
    const prayers = myHabits.filter((h) => h.habit.type === "prayer");
    const others = myHabits.filter((h) => h.habit.type !== "prayer");
    return { prayerHabits: prayers, otherHabits: others };
  }, [myHabits]);

  const { partnerPrayerHabits } = useMemo(() => {
    const prayers = partnerHabitsData.filter((h) => h.habit.type === "prayer");
    return { partnerPrayerHabits: prayers };
  }, [partnerHabitsData]);

  // Convert habit logs to PrayerStatus format for PrayerCard
  const myPrayerStatus = useMemo(() => {
    const status: Record<PrayerName, boolean> = {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    };
    prayerHabits.forEach((h) => {
      if (h.habit.prayer_name && h.log) {
        status[h.habit.prayer_name] = true;
      }
    });
    return status;
  }, [prayerHabits]);

  const partnerPrayerStatus = useMemo(() => {
    const status: Record<PrayerName, boolean> = {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    };
    partnerPrayerHabits.forEach((h) => {
      if (h.habit.prayer_name && h.log) {
        status[h.habit.prayer_name] = true;
      }
    });
    return status;
  }, [partnerPrayerHabits]);

  // Toggle prayer handler - finds the habit and toggles it
  const handleTogglePrayer = async (prayer: PrayerName) => {
    const prayerHabit = prayerHabits.find(
      (h) => h.habit.prayer_name === prayer
    );
    if (prayerHabit) {
      toggleHabit(prayerHabit.habit_id, !!prayerHabit.log);
    }
  };

  // Toggle other habit handler
  const handleToggleHabit = (habitId: string, isCompleted: boolean) => {
    toggleHabit(habitId, isCompleted);
  };

  // Combined loading state
  const isLoading = authLoading || habitsLoading || prayerTimesLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <motion.div
          className="text-4xl gradient-text font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          سوا
        </motion.div>
      </div>
    );
  }

  // Not logged in - show user selection
  if (!user) {
    return <UserSelect />;
  }

  const isAhmad = user.slug === "ahmad";
  const myColor = isAhmad ? "ahmad" : "reem";
  const partnerColor = isAhmad ? "reem" : "ahmad";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 glass border-b border-border px-4 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              emoji={user.slug === "ahmad" ? "👨🏻" : "👩🏻"}
              name={user.name}
              size="sm"
              color={myColor}
              showRing
            />
            <div>
              <h1 className="font-semibold gradient-text">سوا</h1>
              <p className="text-xs text-foreground-muted">{today}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {partner && (
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-secondary border border-border"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Avatar
                  emoji={partner.slug === "ahmad" ? "👨🏻" : "👩🏻"}
                  name={partner.name}
                  size="sm"
                  color={partnerColor}
                />
                <span className="text-sm text-foreground-muted">
                  {partner.name}
                </span>
              </motion.div>
            )}

            <motion.button
              onClick={logout}
              className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Switch user"
            >
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
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="p-4 space-y-6">
        {/* Couple Progress */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <CoupleProgressBar />
        </motion.section>

        {/* Daily Quote */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
        >
          <DailyQuoteCard />
        </motion.section>

        {/* Connection section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <h2 className="text-sm font-medium text-foreground-muted mb-3 flex items-center gap-2">
            <span>💕</span> Connect
          </h2>
          <div className="space-y-3">
            <DailyQuestionCard />
            <CheckInCard />
            <QuickRitualCard />
          </div>
        </motion.section>

        {/* Quests section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <QuestsCard />
        </motion.section>

        {/* Activity Feed section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <ActivityFeedCard />
        </motion.section>

        {/* Shared Inbox section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <SharedInboxCard />
        </motion.section>

        {/* Wish List section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <WishListCard />
        </motion.section>

        {/* Prayer section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
        >
          <h2 className="text-sm font-medium text-foreground-muted mb-3 flex items-center gap-2">
            <span>🕌</span> Prayers
          </h2>
          <div className="space-y-3">
            {/* My prayers */}
            <PrayerCard
              userName={user.name}
              userEmoji={user.slug === "ahmad" ? "👨🏻" : "👩🏻"}
              prayerStatus={myPrayerStatus}
              partnerPrayerStatus={partnerPrayerStatus}
              currentPrayer={currentPrayer}
              onTogglePrayer={handleTogglePrayer}
              isOwner={true}
              color={myColor}
            />

            {/* Partner's prayers */}
            {partner && (
              <PrayerCard
                userName={partner.name}
                userEmoji={partner.slug === "ahmad" ? "👨🏻" : "👩🏻"}
                prayerStatus={partnerPrayerStatus}
                currentPrayer={currentPrayer}
                onTogglePrayer={handleTogglePrayer}
                isOwner={false}
                color={partnerColor}
              />
            )}
          </div>
        </motion.section>

        {/* Relationship habits */}
        {otherHabits.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.19 }}
          >
            <h2 className="text-sm font-medium text-foreground-muted mb-3 flex items-center gap-2">
              <span>💕</span> Together
            </h2>
            <div className="space-y-3">
              {otherHabits.map((userHabit) => (
                <HabitCard
                  key={userHabit.habit_id}
                  habit={userHabit.habit}
                  isCompleted={!!userHabit.log}
                  isPartnerCompleted={
                    partnerHabitsData.find(
                      (ph) => ph.habit.slug === userHabit.habit.slug
                    )?.log !== null
                  }
                  onToggle={() =>
                    handleToggleHabit(userHabit.habit_id, !!userHabit.log)
                  }
                />
              ))}
            </div>
          </motion.section>
        )}
      </main>

      {/* Bottom safe area */}
      <div className="fixed bottom-0 inset-x-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
