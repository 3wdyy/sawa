"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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
    country: "UAE",
    partner_id: USER_IDS.REEM,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  reem: {
    id: USER_IDS.REEM,
    slug: "reem",
    name: "Reem",
    timezone: "Asia/Dubai",
    city: "Dubai",
    country: "UAE",
    partner_id: USER_IDS.AHMAD,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Load user from mock data (localStorage-based auth)
  const loadUser = useCallback((slug: string) => {
    const userData = MOCK_USERS[slug];

    if (!userData) {
      console.error("User not found:", slug);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      setUser(null);
      setPartner(null);
      return;
    }

    setUser(userData);

    // Load partner if exists
    if (userData.partner_id) {
      const partnerData = Object.values(MOCK_USERS).find(
        (u) => u.id === userData.partner_id
      );
      setPartner(partnerData || null);
    }
  }, []);

  // Mount check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize: check localStorage for existing user (only after mount)
  useEffect(() => {
    if (!isMounted) return;

    const storedSlug = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedSlug) {
      loadUser(storedSlug);
    }
    setIsLoading(false);
  }, [isMounted, loadUser]);

  // Login: store slug and load user
  const login = useCallback(
    (userSlug: string) => {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userSlug);
      setIsLoading(true);
      loadUser(userSlug);
      setIsLoading(false);
    },
    [loadUser]
  );

  // Logout: clear storage and state
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
    setPartner(null);
  }, []);

  // Switch to the other user (for testing)
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
