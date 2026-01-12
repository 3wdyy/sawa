"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_KEYS, USER_SLUGS } from "@/lib/constants";
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Load user from localStorage and fetch full data
  const loadUser = useCallback(
    async (slug: string) => {
      try {
        // Fetch user by slug
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("slug", slug)
          .single();

        if (userError || !userData) {
          console.error("Error fetching user:", userError);
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
          setUser(null);
          setPartner(null);
          return;
        }

        setUser(userData);

        // Fetch partner if exists
        if (userData.partner_id) {
          const { data: partnerData } = await supabase
            .from("users")
            .select("*")
            .eq("id", userData.partner_id)
            .single();

          setPartner(partnerData || null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
        setPartner(null);
      }
    },
    [supabase]
  );

  // Initialize: check localStorage for existing user
  useEffect(() => {
    const storedSlug = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedSlug) {
      loadUser(storedSlug).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [loadUser]);

  // Login: store slug and load user
  const login = useCallback(
    (userSlug: string) => {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userSlug);
      setIsLoading(true);
      loadUser(userSlug).finally(() => setIsLoading(false));
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
