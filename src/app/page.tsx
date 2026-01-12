"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/context";
import { UserSelect } from "@/features/auth/components/UserSelect";
import { Avatar } from "@/components/ui/avatar";
import { HabitCard } from "@/features/habits/components/HabitCard";
import { PrayerCard } from "@/features/prayer/components/PrayerCard";
import type { PrayerName } from "@/types/database";

// Force dynamic rendering - no static generation
export const dynamic = "force-dynamic";

// Temporary mock data until Supabase is connected
const mockHabits = [
  {
    id: "morning-photo",
    name: "Morning Photo",
    slug: "morning-photo",
    type: "binary" as const,
    category: "relationship" as const,
    icon: "📸",
    description: "Send a morning photo",
    prayer_name: null,
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "daily-call",
    name: "Daily Call",
    slug: "daily-call",
    type: "dual_confirm" as const,
    category: "relationship" as const,
    icon: "📞",
    description: "Check-in call together",
    prayer_name: null,
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export default function Home() {
  const { user, partner, isLoading, logout } = useAuth();

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

  // Mock prayer status for demo
  const myPrayerStatus = {
    fajr: true,
    dhuhr: true,
    asr: false,
    maghrib: false,
    isha: false,
  };

  const partnerPrayerStatus = {
    fajr: true,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  };

  const isAhmad = user.slug === "ahmad";
  const myColor = isAhmad ? "ahmad" : "reem";
  const partnerColor = isAhmad ? "reem" : "ahmad";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleTogglePrayer = async (prayer: PrayerName) => {
    console.log("Toggle prayer:", prayer);
    // TODO: Implement with Supabase
  };

  const handleToggleHabit = async () => {
    console.log("Toggle habit");
    // TODO: Implement with Supabase
  };

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
        {/* Prayer section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
              currentPrayer="asr"
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
                currentPrayer="asr"
                onTogglePrayer={handleTogglePrayer}
                isOwner={false}
                color={partnerColor}
              />
            )}
          </div>
        </motion.section>

        {/* Relationship habits */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-medium text-foreground-muted mb-3 flex items-center gap-2">
            <span>💕</span> Together
          </h2>
          <div className="space-y-3">
            {mockHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={false}
                isPartnerCompleted={habit.id === "morning-photo"}
                onToggle={handleToggleHabit}
              />
            ))}
          </div>
        </motion.section>
      </main>

      {/* Bottom safe area */}
      <div className="fixed bottom-0 inset-x-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
