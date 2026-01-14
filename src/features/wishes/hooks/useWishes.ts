"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/features/auth/context";
import {
  getUserWishes,
  getPartnerWishes,
  addWish,
  fulfillWish,
  deleteWish,
} from "../api/wishes";
import { logActivity } from "@/features/activity/api/activity";

/**
 * Hook for wish list - each person adds things they'd love
 * Partner sees for gift/date ideas
 */
export function useWishes() {
  const { user, partner } = useAuth();
  const queryClient = useQueryClient();
  const myQueryKey = useMemo(() => ["wishes", "my", user?.id], [user?.id]);
  const partnerQueryKey = useMemo(
    () => ["wishes", "partner", partner?.id],
    [partner?.id]
  );

  // Fetch my wishes
  const { data: myWishes, isLoading: myLoading } = useQuery({
    queryKey: myQueryKey,
    queryFn: () => getUserWishes(user!.id),
    enabled: !!user,
  });

  // Fetch partner's wishes (for gift ideas!)
  const { data: partnerWishes, isLoading: partnerLoading } = useQuery({
    queryKey: partnerQueryKey,
    queryFn: () => getPartnerWishes(partner!.id),
    enabled: !!partner,
  });

  // Separate fulfilled from unfulfilled
  const myUnfulfilled = useMemo(
    () => myWishes?.filter((w) => !w.fulfilled) || [],
    [myWishes]
  );
  const myFulfilled = useMemo(
    () => myWishes?.filter((w) => w.fulfilled) || [],
    [myWishes]
  );
  const partnerUnfulfilled = useMemo(
    () => partnerWishes?.filter((w) => !w.fulfilled) || [],
    [partnerWishes]
  );
  const partnerFulfilled = useMemo(
    () => partnerWishes?.filter((w) => w.fulfilled) || [],
    [partnerWishes]
  );

  // Add wish mutation
  const addMutation = useMutation({
    mutationFn: async ({
      title,
      description,
    }: {
      title: string;
      description?: string;
    }) => {
      if (!user) throw new Error("No user");
      const wish = await addWish(user.id, title, description);
      if (wish) {
        await logActivity(user.id, "wish_added", `Added wish: ${title}`);
      }
      return wish;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myQueryKey });
    },
  });

  // Fulfill wish mutation
  const fulfillMutation = useMutation({
    mutationFn: async (wishId: string) => {
      if (!user) throw new Error("No user");
      const wish = await fulfillWish(wishId);
      if (wish) {
        await logActivity(
          user.id,
          "wish_added", // Using wish_added type for fulfilled wishes too
          `تحققت أمنية: ${wish.title} ✨`,
          "wish",
          wishId
        );
      }
      return wish;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myQueryKey });
      queryClient.invalidateQueries({ queryKey: partnerQueryKey });
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
    },
  });

  // Delete wish mutation
  const deleteMutation = useMutation({
    mutationFn: (wishId: string) => deleteWish(wishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myQueryKey });
    },
  });

  return {
    // My wishes
    myWishes: myWishes || [],
    myUnfulfilled,
    myFulfilled,
    // Partner's wishes (gift ideas!)
    partnerWishes: partnerWishes || [],
    partnerUnfulfilled,
    partnerFulfilled,
    // Loading state
    isLoading: myLoading || partnerLoading,
    // Actions
    add: (title: string, description?: string) =>
      addMutation.mutate({ title, description }),
    fulfill: (wishId: string) => fulfillMutation.mutate(wishId),
    remove: (wishId: string) => deleteMutation.mutate(wishId),
    isAdding: addMutation.isPending,
  };
}
