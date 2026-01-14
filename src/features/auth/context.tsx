"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { STORAGE_KEYS, USER_SLUGS, USER_IDS } from "@/lib/constants";
import type { User } from "@/types/database";

interface AuthContextType {
  user: User | null;
  partner: User | null;
  isLoading: boolean;
  login: (userSlug: string) => void;
  logout: () => void;
  switchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development (no Supabase required)
const MOCK_USERS: Record<string, User> = {
  ahmad: {
    id: USER_IDS.AHMAD,
    slug: "ahmad",
    name: "Ahmad",
    timezone: "Asia/Dubai",
    city: "Dubai",
    country: "AE",
    partner_id: USER_IDS.REEM,
    xp: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  reem: {
    id: USER_IDS.REEM,
    slug: "reem",
    name: "Reem",
    timezone: "Africa/Cairo",
    city: "Cairo",
    country: "EG",
    partner_id: USER_IDS.AHMAD,
    xp: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

// Helper to get user from slug
function getUserFromSlug(slug: string | null): User | null {
  if (!slug) return null;
  return MOCK_USERS[slug] || null;
}

// Helper to get partner from user
function getPartnerFromUser(user: User | null): User | null {
  if (!user || !user.partner_id) return null;
  return Object.values(MOCK_USERS).find((u) => u.id === user.partner_id) || null;
}

// Subscribe to localStorage changes
function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// Get current user slug from localStorage
function getStoredSlug() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
}

// Server snapshot (always null during SSR)
function getServerSnapshot() {
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore for hydration-safe localStorage access
  const storedSlug = useSyncExternalStore(
    subscribeToStorage,
    getStoredSlug,
    getServerSnapshot
  );

  // Derive user and partner from stored slug
  const user = getUserFromSlug(storedSlug);
  const partner = getPartnerFromUser(user);

  // Loading is false once we have hydrated (storedSlug could be null but that's valid)
  const isLoading = false;

  // Login: store slug in localStorage
  const login = useCallback((userSlug: string) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userSlug);
    // Trigger re-render by dispatching storage event
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEYS.CURRENT_USER }));
  }, []);

  // Logout: clear storage
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEYS.CURRENT_USER }));
  }, []);

  // Switch to the other user
  const switchUser = useCallback(() => {
    const currentSlug = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const newSlug =
      currentSlug === USER_SLUGS.AHMAD ? USER_SLUGS.REEM : USER_SLUGS.AHMAD;
    login(newSlug);
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        isLoading,
        login,
        logout,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
