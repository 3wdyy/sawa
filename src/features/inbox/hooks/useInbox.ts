"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/features/auth/context";
import {
  getAllInboxItems,
  addInboxItem,
  completeInboxItem,
  deleteInboxItem,
} from "../api/inbox";
import type { InboxCategory, InboxItem } from "@/types/database";

/**
 * Categories with display info
 */
export const INBOX_CATEGORIES: {
  id: InboxCategory;
  emoji: string;
  label: string;
}[] = [
  { id: "idea", emoji: "💡", label: "أفكار" },
  { id: "todo", emoji: "✅", label: "مهام" },
  { id: "dream", emoji: "🌟", label: "أحلام" },
  { id: "memory", emoji: "📸", label: "ذكريات" },
];

/**
 * Hook for shared inbox - categorized shared space for ideas, plans, dreams
 */
export function useInbox() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["inbox-items"], []);

  // Fetch all inbox items
  const { data: items, isLoading } = useQuery({
    queryKey,
    queryFn: getAllInboxItems,
  });

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<InboxCategory, InboxItem[]> = {
      idea: [],
      todo: [],
      dream: [],
      memory: [],
    };

    items?.forEach((item) => {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      }
    });

    return grouped;
  }, [items]);

  // Add item mutation
  const addMutation = useMutation({
    mutationFn: async ({
      category,
      title,
      notes,
    }: {
      category: InboxCategory;
      title: string;
      notes?: string;
    }) => {
      if (!user) throw new Error("No user");
      return addInboxItem(user.id, category, title, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Complete item mutation (for todos)
  const completeMutation = useMutation({
    mutationFn: (itemId: string) => completeInboxItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Delete item mutation
  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => deleteInboxItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    items: items || [],
    itemsByCategory,
    isLoading,
    add: (category: InboxCategory, title: string, notes?: string) =>
      addMutation.mutate({ category, title, notes }),
    complete: (itemId: string) => completeMutation.mutate(itemId),
    remove: (itemId: string) => deleteMutation.mutate(itemId),
    isAdding: addMutation.isPending,
  };
}
