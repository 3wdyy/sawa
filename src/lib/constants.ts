/**
 * Application constants
 */

// User IDs (matching seed data)
export const USER_IDS = {
  AHMAD: "a0000000-0000-0000-0000-000000000001",
  REEM: "a0000000-0000-0000-0000-000000000002",
} as const;

// User slugs for simple auth
export const USER_SLUGS = {
  AHMAD: "ahmad",
  REEM: "reem",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: "sawa_current_user",
  PRAYER_TIMES_CACHE: "sawa_prayer_times",
} as const;

// Prayer names in order
export const PRAYER_NAMES = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
] as const;

// Prayer display names (Arabic)
export const PRAYER_DISPLAY_NAMES: Record<string, string> = {
  fajr: "الفجر",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

// Aladhan API base URL
export const ALADHAN_API_URL = "https://api.aladhan.com/v1";

// Calculation method for prayer times (Egyptian General Authority of Survey)
// Method 5 is commonly used for Egypt, Method 4 (Umm Al-Qura) for UAE
export const PRAYER_CALCULATION_METHODS = {
  EGYPT: 5,
  UAE: 4,
} as const;
