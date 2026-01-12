"use client";

import { useAuth } from "../context";

/**
 * Convenience hook for accessing current user
 * Throws if used outside AuthProvider
 */
export function useUser() {
  const { user, isLoading } = useAuth();
  return { user, isLoading };
}

/**
 * Convenience hook for accessing partner
 * Throws if used outside AuthProvider
 */
export function usePartner() {
  const { partner, isLoading } = useAuth();
  return { partner, isLoading };
}
