import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { AttributeType, EntityType } from "@/types";
import { useUserStore } from "./useUserStore";

export interface PointsStoreState {
  balance: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  earnPoints: (
    amount: number,
    entityId: string,
    entityType: EntityType,
    attributeType?: AttributeType,
    attributeXp?: number
  ) => Promise<void>;

  spendPoints: (amount: number, rewardId: string) => Promise<boolean>;

  getBalance: () => number;
}

export const usePointsStore = create<PointsStoreState>((set, get) => ({
  balance: 850,
  isLoading: false,
  error: null,

  earnPoints: async (amount, entityId, entityType, attributeType, attributeXp = 0) => {
    const prevBalance = get().balance;
    const newBalance = prevBalance + amount;

    // Optimistic balance update
    set({ balance: newBalance });

    // Sync attribute XP with userStore if applicable
    if (attributeType && attributeXp > 0) {
      const { currentUser, updateUser } = useUserStore.getState();
      if (currentUser) {
        const attrLevelKey = `${attributeType}_level` as keyof typeof currentUser;
        const attrXpKey = `${attributeType}_xp` as keyof typeof currentUser;

        const currentAttrLevel = (currentUser[attrLevelKey] as number) || 1;
        const currentAttrXp = (currentUser[attrXpKey] as number) || 0;
        let newAttrXp = currentAttrXp + attributeXp;
        let newAttrLevel = currentAttrLevel;

        const threshold = newAttrLevel * 100;
        if (newAttrXp >= threshold) {
          newAttrXp -= threshold;
          newAttrLevel += 1;
        }

        updateUser({
          total_xp: currentUser.total_xp + attributeXp,
          [attrXpKey]: newAttrXp,
          [attrLevelKey]: newAttrLevel,
        });
      }
    }

    try {
      const supabase = createClient();
      const user = (await supabase.auth.getUser()).data.user;

      if (user) {
        await supabase.from("activity_log").insert({
          user_id: user.id,
          entity_type: entityType,
          entity_id: entityId,
          action_type: "completed",
          points_change: amount,
          attribute_xp_gained: attributeXp,
          attribute_type: attributeType || null,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to record earned points";
      set({ error: message });
    }
  },

  spendPoints: async (amount, rewardId) => {
    const currentBalance = get().balance;
    if (currentBalance < amount) {
      set({ error: "Insufficient balance" });
      return false;
    }

    const prevBalance = currentBalance;
    const newBalance = currentBalance - amount;

    // Optimistic update
    set({ balance: newBalance });

    try {
      const supabase = createClient();
      const user = (await supabase.auth.getUser()).data.user;

      if (user) {
        await supabase.from("activity_log").insert({
          user_id: user.id,
          entity_type: "reward",
          entity_id: rewardId,
          action_type: "redeemed",
          points_change: -amount,
          attribute_xp_gained: 0,
        });
      }

      return true;
    } catch (err: unknown) {
      // Rollback on error
      set({ balance: prevBalance, error: err instanceof Error ? err.message : "Failed to redeem reward" });
      return false;
    }
  },

  getBalance: () => get().balance,
}));
